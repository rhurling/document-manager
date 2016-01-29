<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

use App\File;

Route::group(
    [ 'middleware' => 'web' ],
    function () {
        Route::auth();

        Route::get(
            '/',
            [
                'middleware' => 'auth',
                function () {
                    return view( 'app' );
                }
            ]
        );

        Route::get( '/file/{uuid}/pdf', 'FileController@file_pdf' )->name( 'file_pdf' );
        Route::get( '/file/{uuid}/image', 'FileController@file_image' )->name( 'file_image' );
    }
);

Route::group(
    [ 'middleware' => 'api' ],
    function () {
        Route::resource( 'file', 'FileController', [ 'except' => [ 'create', 'edit' ] ] );
        Route::get(
            'tags',
            function () {
                return File::existingTags();
            }
        );
    }
);
