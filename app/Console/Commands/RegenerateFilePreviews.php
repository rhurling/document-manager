<?php

namespace App\Console\Commands;

use App\File;
use App\Jobs\GeneratePreviewImage;
use Illuminate\Console\Command;

class RegenerateFilePreviews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'files:regenerate-previews';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Queues the GeneratePreviewImage Job for every File to force regeneration of all Previews';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        File::all()->each(
            function ( $file ) {
                dispatch( new GeneratePreviewImage( $file ) );
            }
        );
    }
}
