<?php

namespace App\Jobs;

use App\File;
use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Symfony\Component\Process\Process;

class GeneratePreviewImage extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels, SystemHelper;

    protected $file;

    /**
     * Create a new job instance.
     *
     * @param File $file
     *
     * @return void
     */
    public function __construct( File $file )
    {
        $this->file = $file;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $system      = $this->getSystem();
        $binary      = resource_path( 'bin/xpdf/' . $system . '/pdftopng' . $this->getExtension( $system ) );
        $destination = storage_path( 'app/previews/' );
        $process     = new Process(
            $binary . ' -l 1 ' . storage_path( 'app/files/' . $this->file->uuid . '.pdf' ) . ' ' . $this->file->uuid,
            $destination
        );

        $process->mustRun();

        $image_path = $destination . $this->file->uuid . '.png';
        \File::move( $destination . $this->file->uuid . '-000001.png', $image_path );

        $constraint = function ( $constraint ) {
            $constraint->aspectRatio();
            $constraint->upsize();
        };

        $image = \Image::make( $image_path );
        if ($image->width() / $image->height() - 1.326315789 < 0) {
            $image->resize( 504, null, $constraint );
        } else {
            $image->resize( null, 380, $constraint );
        }

        $image->save( $image_path );
    }
}
