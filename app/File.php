<?php

namespace App;

use App\Jobs\GeneratePreviewImage;
use App\Jobs\ReadFileContent;
use Conner\Tagging\Taggable;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use Sofa\Eloquence\Eloquence;

/**
 * App\File
 *
 * @property integer $id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property integer $user_id
 * @property string $title
 * @property string $uuid
 * @property string $content
 */
class File extends Model
{
    use Eloquence, Taggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [ 'user_id', 'title' ];

    protected $hidden = [ 'id', 'content' ];

    protected $searchableColumns = [ 'title' => 1.1, 'content' ];

    protected static function boot()
    {
        parent::boot();

        File::creating(
            function ( $file ) {
                $file->uuid = Uuid::uuid4();
            }
        );

        File::deleted(
            function ( $file ) {
                \File::delete(
                    [
                        storage_path( 'app/files/' . $file->uuid . '.pdf' ),
                        storage_path( 'app/previews/' . $file->uuid . '.png' )
                    ]
                );
            }
        );
    }

}
