module.exports = {
	env: {
		'cypress/globals': true,
		mocha: true,
		browser: true,
		es6: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 8,
	},
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:cypress/recommended',
		'plugin:mocha/recommended',
	],
	plugins: ['cypress', 'mocha'],
	rules: {
		'cypress/no-assigning-return-values': 'error',
		'cypress/no-unnecessary-waiting': 'error',
		'cypress/no-async-tests': 'error',
		'mocha/no-setup-in-describe': 'off',
		'max-len': ['error', { code: 120 }],
		'mocha/no-empty-description': [
			'warn',
			{
				testNames: ['it', 'content', 'describe'],
				message: 'Please specify a description',
			},
		],
		'mocha/no-sibling-hooks': 'error',
		'mocha/no-pending-tests': 'error',
		'mocha/no-identical-title': 'error',
		'mocha/no-hooks-for-single-case': 'warn',
		'mocha/no-exclusive-tests': 'error',
	},
};
