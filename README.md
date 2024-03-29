[![CI](https://github.com/JoseLion/rxjs-axios/actions/workflows/ci.yml/badge.svg)](https://github.com/JoseLion/rxjs-axios/actions/workflows/ci.yml)
[![CodeQL](https://github.com/JoseLion/rxjs-axios/actions/workflows/codeql.yml/badge.svg)](https://github.com/JoseLion/rxjs-axios/actions/workflows/codeql.yml)
[![Pages](https://github.com/JoseLion/rxjs-axios/actions/workflows/pages.yml/badge.svg)](https://github.com/JoseLion/rxjs-axios/actions/workflows/pages.yml)
[![Release](https://github.com/JoseLion/rxjs-axios/actions/workflows/release.yml/badge.svg)](https://github.com/JoseLion/rxjs-axios/actions/workflows/release.yml)
[![NPM version](https://img.shields.io/npm/v/rxjs-axios?logo=npm)](https://www.npmjs.com/package/rxjs-axios)
[![NPM bundle size](https://img.shields.io/bundlephobia/min/rxjs-axios)](https://www.npmjs.com/package/rxjs-axios)
[![NPM downloads](https://img.shields.io/npm/dm/rxjs-axios)](https://www.npmjs.com/package/rxjs-axios)
[![NPM license](https://img.shields.io/npm/l/rxjs-axios)](https://github.com/JoseLion/rxjs-axios/blob/main/LICENSE)
[![GitHub Release Date](https://img.shields.io/github/release-date/JoseLion/rxjs-axios)](https://github.com/JoseLion/rxjs-axios/releases)
[![Known Vulnerabilities](https://snyk.io/test/github/JoseLion/rxjs-axios/badge.svg)](https://snyk.io/test/github/JoseLion/rxjs-axios)

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
  - Uses [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) instead of Axios deprecated `CancelToken`.
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

[MIT License](https://github.com/JoseLion/rxjs-axios/blob/main/LICENSE)
