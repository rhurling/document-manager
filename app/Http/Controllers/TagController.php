<?php

namespace App\Http\Controllers;

use App\File;
use Conner\Tagging\Model\Tag;
use Illuminate\Http\Request;

use App\Http\Requests;

class TagController extends Controller
{

    public function index()
    {
        return Tag::orderBy('count', 'desc')->get();
    }

    public function multi_add( Request $request )
    {
        File::whereIn( 'uuid', $request->get( 'files' ) )->get()->each(
            function ( File $file ) use ( $request ) {
                $file->tag( $request->get( 'tags' ) );
            }
        );
    }

    public function multi_remove( Request $request )
    {
        File::whereIn( 'uuid', $request->get( 'files' ) )->get()->each(
            function ( File $file ) use ( $request ) {
                $file->untag( $request->get( 'tags' ) );
            }
        );
    }

}
