# MMM-JustForTodayMeditation

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Narcotics Anonomous Just For Today Meditation Display for Magic Mirror2

Thanks to the BibleGateway module as it was used as a starting point.

Simple installation


Using Console, from /MagicMirror

`
cd modules
`

`
git clone https://github.com/LeftBrainCreated/MMM-JustForTodayMeditation.git
`

`
cd MMM-JustForTodayMeditation
`

`
npm i
`


## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
		{
			module: 'MMM-JustForTodayMeditation',
			position: 'bottom_bar',
			config: {
				interval: 3 // refresh every x hours
				, retryDelay: 5000 // time in milliseconds
				, size: 'xsmall'
			}
		},
  ]
};
```

## Configuration options

| Option    | Description                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| `interval` | _Optional_ Refresh time, in hours Default is 3 hrs |
| `retryDelay` | _Optional_ When to try again, on failure |
| `size` | _Optional_ Size of text, default is |
