<div align="center">
<img alt="react-hot-toast - Try it out" src="./nano.svg"/></div>
<br />
<h1 align="center">Incredibly lightweight <u><i>0.5kb</i></u>, blazing fast, easy to use state management utility</h1>
<div align="center">
<a href="#">Website</a> 
<span> · </span>
<a href="#getting-started">Documentation</a> 
</div>
<br/>

 - React Nano Store is designed to **prevent unnecessary component re-renders** by only re-rendering components if their dependent value has changed.  
  - It requires **no boilerplate code**, making it very easy to create a store and get started. 
  - No need to write any types for the store, as the hook will be **type-safe by default**.
  - No need to wrap your app/page/compoent in Provider, it just works.

  *React Nano Store provides solutions to many of the issues commonly associated with using React.Context, such as unnecessary re-renders the need for boilerplate code, and difficulty of use.*

##  Installation

#### With yarn

```sh
yarn add react-nano-store
```

#### With NPM

```sh
npm install react-nano-store
```

## Getting Started

You can create a store anywhere in your app and use the hooks returned by it to ensure that you have access to the store wherever you use the hook.

```jsx
import { createStore } from 'react-nano-store';

const initialStoreValue = {name: 'Baby Yoda', age: 50 }

const  useStore = createStore(initialStoreValue);

const ComponentOne = () => {
    //hook takes an array of string, which tells it what values to get from store
	const [{count}, updateStore] = useStore(['age']); 
	return (
		<button onClick={updateStore({age: age+1)}>
			{count}
		</button>
	);
}

const ComponentTwo = () => {
	const [{count}] = useStore(['count']);
	return (
		<div>
		{count} // count here will automatically get updated when changed from ComponentOne
		</div>
	);
}

```

## API

The react-nano-store library returns a function that creates a store. This function takes an initial store value and returns a hook that can be used in any component to access and update the store value.

```jsx
import { createStore } from 'react-nano-store';
// you can name this hook anything
const initialStore = {name: 'Baby Yoda', age: 50 };

const  useStore = createStore(initialStore);
```

### Hook

The hook returned by the `createStore` function takes an array of strings (representing the keys of the store object) as an argument. It returns an array containing two items:

1. The first item is an object that consists of the values for the keys passed to the hook.
2. The second item is a store update function that can update the values in the store. This function will only update the values for the keys that were passed as arguments to the hook. It is not possible to pass any other data to the update function.

```jsx
const initialStore = {name: 'Baby Yoda', age: 50 };

const  useStore = createStore(initialStore);

const [{name}, updateState] = useStore(['name'])
```
