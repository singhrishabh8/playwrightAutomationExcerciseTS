/** Shape returned by automationexercise practice APIs (verified in Phase 1). */
export type ApiEnvelope<T extends Record<string, unknown> = Record<string, unknown>> = {
  responseCode: number;
  message?: string;
} & T;

export type Product = {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
};

export type BrandRow = {
  id: number;
  brand: string;
};

export type CreateAccountParams = {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs' | 'Miss';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
};

export type UserDetail = {
  id: number;
  name: string;
  email: string;
  title: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
};
