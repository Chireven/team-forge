import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

export interface EventEnvelope<T = any> {
    event: string;
    payload: T;
    meta: {
        source: string;
        timestamp: string;
        traceId: string;
    };
}

class GlobalEventBus {
    private eventStream = new Subject<EventEnvelope>();

    /**
     * Emits an event to the global bus.
     * @param event The event name (NOUN:VERB)
     * @param payload The data to carry
     * @param source The component/plugin name emitting the event
     */
    emit<T>(event: string, payload: T, source: string): void {
        const envelope: EventEnvelope<T> = {
            event,
            payload,
            meta: {
                source,
                timestamp: new Date().toISOString(),
                traceId: uuidv4(),
            },
        };
        this.eventStream.next(envelope);
    }

    /**
     * Listens for specific events.
     * @param event The event name to filter for
     */
    on<T>(event: string): Observable<EventEnvelope<T>> {
        return this.eventStream.pipe(
            filter((envelope) => envelope.event === event),
            map((envelope) => envelope as EventEnvelope<T>)
        );
    }

    /**
     * Returns the raw stream for debugging or wildcard listening
     */
    asObservable(): Observable<EventEnvelope> {
        return this.eventStream.asObservable();
    }
}

export const eventBus = new GlobalEventBus();
