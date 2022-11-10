[![CircleCI](https://dl.circleci.com/status-badge/img/gh/JoseLion/rxjs-axios/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/JoseLion/rxjs-axios/tree/main)
[![npm version](https://badge.fury.io/js/rxjs-axios.svg)](https://badge.fury.io/js/rxjs-axios)

# rxjs-axios
A complete Axios wrapper that uses RxJS observables instead of promises. Same Axios API, but anything that used to return a `Promise<T>` will now return an `Observable<T>` instead.

## Overview
Even though there are a few options out there for Axios wrappers converting its promise-based methods to observables, this library offers a few extra features that make it different:

- Based on Axios **v1.0.0** and forward.
- TypeScript first oriented.
  - Written 100% in TypeScript; everything has type definitions.
  - All Axios types are re-exported, so you can import everything from `rxjs-axios`.
  - Methods no longer default their type to `any`. Instead, they default to `unknown`, which not only makes things safer but also forces you to add better types to your code.
- Unsubscribing cancels the request.
  - Cancellation happens on the observable teardown logic, with no mutation or workarounds.
  - Setting a cancel token on the request config has no effect. Cancellation is always handled by the observable.
- Seamless usage; works just like Axios.
  - Besides the Observables, you won't feel any difference with Axios API.
  - All Axios methods are provided. Other libraries only provide the most commonly used methods (e.g., `get`, `post`, `put`, etc.), while rxjs-axios provide everything available in the Axios instance, like `request(..)`, all form-related methods (e.g., `postForm(..)`, `toFormData(..)`, `formToJSON(..)`, etc.), `isAxiosError(..)`, `defaults`, `interceptors`.
- Fully tested.
  - Ensure compatibility around NodeJS, Axios, and RxJS versions.
  - Safer upgrades, no unexpected surprises.

## Versions Compatibility

- **NodeJS:** >=16
- **Axios:** >=1.0.0
- **RxJS:** >=5.5.12

## Install
This library has `axios` and `rxjs` as required peer dependencies, so don't forget to add them too.

With NPM:
```
npm i rxjs-axios axios rxjs
```

With Yarn:
```
yarn add rxjs-axios axios rxjs
```

## Usage
You can use `rxjs-axios` the same way as you would do with Axios. The only difference is that request will result in an `Observable<AxiosResponse<T>>`, so you'll have to subscribe to the observable to get the response. If you're using TypeScript, remember to add a type to the method's generic 😉.

Simple example:
```ts
import { axios } from "rxjs-axios";
import { map } from "rxjs"

axios.get<User[]>("/api/users")
  .pipe(map(({ data }) => data))
  .subscribe(users => {
    // do anything with users array
  });
```

This becomes particularly cleaner on ReactJS, as you can unsubscribe on the `useEffect(..)` clean-up callback:
```tsx
import { ReactElement, useEffect, useState } from "react";
import { axios } from "rxjs-axios";
import { finalize, map } from "rxjs"

function UsersScreen(): ReactElement {
  const [pending, setPending] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setPending(true);

    const subscription = axios.get<User[]>("/api/users")
      .pipe(
        map(({ data }) => data),
        finalize(() => setPending(false)),
      )
      .subscribe(setUsers);

    // The request will be canceled if the component is unmounted and the
    // subscription was not yet complete
    return () => subscription.unsubscribe();
  }, []);

  return (
    <DataTable
      pending={pending}
      data={users}
      // ...rest of DataTable props
    />
  )
}
```

## Something's missing?

Suggestions are always welcome! Please create an [issue](https://github.com/JoseLion/rxjs-axios/issues/new) describing the request, feature, or bug. We'll try to look into it as soon as possible 🙂

## Contributions

Contributions are very welcome! To do so, please fork this repository and open a Pull Request to the `main` branch.

## License

[MIT License](./LICENSE)
