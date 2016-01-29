<?php

use App\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create(
            [
                'name'     => env( 'APP_USER_NAME' ),
                'email'    => env( 'APP_USER_EMAIL' ),
                'password' => bcrypt( env( 'APP_USER_PASSWORD' ) )
            ]
        );
    }
}
