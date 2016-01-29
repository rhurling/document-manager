<?php

namespace App\Jobs;

trait SystemHelper
{

    /**
     * Get the operating system for the current platform.
     *
     * @return string
     */
    protected function getSystem()
    {
        $uname = strtolower( php_uname() );

        if (str_contains( $uname, 'darwin' )) {
            return 'macosx';
        } elseif (str_contains( $uname, 'win' )) {
            return 'windows';
        } elseif (str_contains( $uname, 'linux' )) {
            return PHP_INT_SIZE === 4 ? 'linux-i686' : 'linux-x86_64';
        } else {
            throw new \RuntimeException( 'Unknown operating system.' );
        }
    }

    /**
     * Get the binary extension for the system.
     *
     * @param  string  $system
     * @return string
     */
    protected function getExtension($system)
    {
        return $system == 'windows' ? '.exe' : '';
    }

}