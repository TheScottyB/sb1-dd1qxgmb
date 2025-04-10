// Type definitions for Deno and Supabase Edge Functions

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

declare module 'npm:stripe@17.7.0' {
  namespace Stripe {
    interface Event {
      type: string;
      data: {
        object: any;
      };
    }

    namespace Checkout {
      interface Session {
        id: string;
        customer: string;
        mode: string;
        payment_status: string;
        payment_intent: string;
        amount_subtotal: number;
        amount_total: number;
        currency: string;
        invoice?: string;
      }
    }
  }

  export default class Stripe {
    constructor(apiKey: string, options?: any);
    checkout: {
      sessions: {
        create(params: any): Promise<any>;
      };
    };
    customers: {
      create(params: any): Promise<any>;
      del(id: string): Promise<any>;
    };
    webhooks: {
      constructEvent(payload: string, signature: string, secret: string): Stripe.Event;
      constructEventAsync?(payload: string, signature: string, secret: string): Promise<Stripe.Event>;
    };
    subscriptions: {
      list(params: any): Promise<{
        data: Array<{
          id: string;
          customer: string;
          status: string;
          current_period_start: number;
          current_period_end: number;
          cancel_at_period_end: boolean;
          default_payment_method: any;
          items: {
            data: Array<{
              price: {
                id: string;
              };
            }>;
          };
        }>;
      }>;
    };
  }
}

declare module 'npm:@supabase/supabase-js@2.49.1' {
  export function createClient(url: string, key: string): any;
}

declare const EdgeRuntime: {
  waitUntil(promise: Promise<any>): void;
};