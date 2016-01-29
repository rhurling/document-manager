<?php

namespace App\Jobs;

use App\File;
use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Symfony\Component\Process\Process;

class ReadFileContent extends Job implements ShouldQueue
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
        $system  = $this->getSystem();
        $binary  = resource_path( 'bin/xpdf/' . $system . '/pdftotext' . $this->getExtension( $system ) );
        $process = new Process(
            $binary . ' -enc UTF-8 ' . storage_path( 'app/files/' . $this->file->uuid . '.pdf' ) . ' -',
            base_path()
        );

        $process->mustRun();

        $this->file->content = $process->getOutput();
        $this->file->save();
    }

}
