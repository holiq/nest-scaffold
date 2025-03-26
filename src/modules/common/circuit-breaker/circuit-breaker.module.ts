import { Module } from '@nestjs/common';
import { CircuitBreaker } from './circuit-breaker.provider';
import { SafeRequestService } from '@services/safe-request.service';

@Module({
  providers: [CircuitBreaker, SafeRequestService],
  exports: [SafeRequestService],
})
export class CircuitBreakerModule {}
