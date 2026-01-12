import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, verify } from 'argon2';
import { User } from '@team-forge/shared/data-access';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async getStatus(): Promise<{ isSetupRequired: boolean }> {
        const count = await this.usersRepository.count();
        return { isSetupRequired: count === 0 };
    }

    async setup(email: string, password: string): Promise<{ access_token: string }> {
        const count = await this.usersRepository.count();
        if (count > 0) {
            throw new ForbiddenException('Setup already completed');
        }

        const passwordHash = await hash(password);
        const newUser = this.usersRepository.create({
            email,
            passwordHash,
            isSuperAdmin: true,
        });

        await this.usersRepository.save(newUser);
        return this.login(newUser);
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user && (await verify(user.passwordHash, pass))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, isSuperAdmin: user.isSuperAdmin };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
