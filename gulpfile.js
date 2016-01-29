var elixir = require('laravel-elixir');

elixir.config.js.browserify.transformers[0].options.presets.push('stage-0');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('app.scss');
    mix.browserify('app.js');

    mix.version(['css/app.css', 'js/app.js']);
});
