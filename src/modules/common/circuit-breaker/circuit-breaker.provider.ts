import { Injectable, Logger } from '@nestjs/common';
import * as Opossum from 'opossum';

export type CBOptions = Opossum.Options & {
  logState?: boolean;
  responseLogging?: boolean;
  method: string;
  path: string;
  getResponseData: (response) => unknown;
  getErrorData: (err) => unknown;
  getErrorStatus: (err) => number;
};

@Injectable()
export class CircuitBreaker {
  private logger = new Logger('[CircuitBreaker]');

  private cbInstance: Record<string, Opossum> = {};

  async fire<T>(
    action: (args: unknown) => Promise<T>,
    options: CBOptions,
    ...args: unknown[]
  ): Promise<T> {
    const key = `${options.method}_${options.path}`;

    if (!this.cbInstance[key]) {
      this.cbInstance[key] = new Opossum(action, {
        timeout: 30000,
        errorThresholdPercentage: 60,
        volumeThreshold: 10,
        errorFilter: (err) => {
          return options.getErrorStatus(err) < 500;
        },
        ...options,
        name: key,
        group: key,
      });

      this.cbInstance[key]
        .on('reject', () => this.logger.warn(`REJECT: ${key}`, 'Request Log'))
        .on('open', () =>
          this.logger.warn(
            `OPEN: The cb for ${key} just opened.`,
            'Request Log',
          ),
        )
        .on('timeout', () =>
          this.logger.warn(
            `TIMEOUT: ${key} is taking too long to respond.`,
            'Request Log',
          ),
        )
        .on('halfOpen', () =>
          this.logger.warn(
            `HALF_OPEN: The cb for ${key} is half open.`,
            'Request Log',
          ),
        )
        .on('close', () =>
          this.logger.log(
            `CLOSE: The cb for ${key} has closed. Service OK.`,
            'Request Log',
          ),
        );
    }

    const startTime = new Date().getTime();

    let logResponse: unknown;

    return this.cbInstance[key]
      .fire(...args)
      .then((response) => {
        logResponse = options.getResponseData(response);
        return response;
      })
      .catch((e) => {
        logResponse = options.getErrorData(e);
        const message = e.response?.message || e.message || e;

        this.logger.error(
          `[Error] [${key}] ${JSON.stringify(message)}`,
          e.stack,
          'Request Log',
        );
        throw e;
      })
      .finally(() => {
        const duration = new Date().getTime() - startTime;

        if (options.responseLogging) {
          this.logger.log(
            `[Response] The response for ${key}`,
            {
              duration,
              response: logResponse,
              request: args,
            },

            'Request Log',
          );
        }
        if (options.logState) {
          this.logger.log(
            `[State] The state cb for ${key}`,
            {
              state: this.cbInstance[key].toJSON(),
            },
            'Request Log',
          );
        }
      }) as T;
  }
}
