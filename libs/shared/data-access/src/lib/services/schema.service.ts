import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface SchemaStatus {
    status: 'Healthy' | 'Degraded' | 'Drifted';
    pendingMigrations: number;
}

@Injectable()
export class SchemaService {
    private readonly logger = new Logger(SchemaService.name);

    constructor(private dataSource: DataSource) { }

    /**
     * Run a non-destructive comparison between code entities and live DB schema.
     * Rule 11.2: Startup & On-Demand Checks
     */
    async checkHealth(): Promise<SchemaStatus> {
        try {
            // DataSource.showMigrations() returns true if there are pending migrations
            const pendingMigrations = await this.dataSource.showMigrations();

            // We can also check if the schema itself has drift vs entities
            // but TypeORM doesn't have a simple async "check drift" other than migrations
            // A more thorough check is dataSource.runMigrations({ transaction: 'all' }) 
            // but that is destructive or active.

            if (pendingMigrations) {
                return { status: 'Drifted', pendingMigrations: 1 }; // Simplified count
            }

            return { status: 'Healthy', pendingMigrations: 0 };
        } catch (error: any) {
            this.logger.error(`Drift detection failed: ${error.message}`);
            return { status: 'Degraded', pendingMigrations: 0 };
        }
    }

    /**
     * Rule 11.3: Self-Healing Enforcement
     * Manually trigger schema healing (run migrations).
     */
    async heal(): Promise<{ success: boolean; migrationsRun: string[] }> {
        this.logger.log('Starting Manual Schema Healing...');

        // In Dev, we might just use synchronize(false) but Rule 11.3 mandates migrations
        // For this implementation, we run all pending migrations.

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const runMigrations = await this.dataSource.runMigrations();
            await queryRunner.commitTransaction();

            this.logger.log(`Heal successful. Migrations executed: ${runMigrations.length}`);
            return {
                success: true,
                migrationsRun: runMigrations.map(m => m.name || 'unnamed_migration')
            };
        } catch (error: any) {
            this.logger.error(`Heal failed: ${error.message}`);
            await queryRunner.rollbackTransaction();
            return { success: false, migrationsRun: [] };
        } finally {
            await queryRunner.release();
        }
    }
}
