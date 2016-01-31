<?php

namespace App\Http\Controllers;

use App\File;
use App\Jobs\GeneratePreviewImage;
use App\Jobs\ReadFileContent;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

use App\Http\Requests;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $files = File::search( \Request::get( 's' ) )->with( 'tagged' )->orderBy( 'created_at', 'desc' );

        if ( ! empty( \Request::get( 'tags' ) )) {
            $files->withAllTags( \Request::get( 'tags' ) );
        }

        return $files->paginate();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store( Request $request )
    {
        $validator = \Validator::make( $request->all(), [ 'file' => 'mimes:pdf', 'tags' => 'string' ] );
        if ($validator->fails()) {
            return \Response::make( $validator->errors()->first(), 415 );
        }

        $pdf   = $request->file( 'file' );
        $title = str_replace( '.' . $pdf->getClientOriginalExtension(), '', $pdf->getClientOriginalName() );
        $file  = File::create(
            [
                'user_id' => $request->user()->id,
                'title'   => $title,
            ]
        );
        if ( ! empty( $request->get( 'tags' ) )) {
            $file->retag( $request->get( 'tags' ) );
        }

        if ($pdf->move( storage_path( 'app/files/' ), $file->uuid . '.pdf' )) {
            dispatch( new ReadFileContent( $file ) );
            dispatch( new GeneratePreviewImage( $file ) );
            return $file;
        } else {
            return \Response::json( 'error', 500 );
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show( $id )
    {
        $file = File::where( 'uuid', $id )->first();

        if ( ! $file) {
            throw new ModelNotFoundException;
        }

        return $file;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update( Request $request, $id )
    {
        $file = File::where( 'uuid', $id )->first();

        if ( ! $file) {
            throw new ModelNotFoundException;
        }

        $file->title = $request->get( 'title' );
        $file->save();
        if (empty( $request->get( 'tags' ) )) {
            $file->untag();
        } else {
            $file->retag( $request->get( 'tags' ) );
        }

        return $file;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy( $id )
    {
        $file = File::where( 'uuid', $id )->first();

        if ( ! $file) {
            throw new ModelNotFoundException;
        }

        return intval( $file->delete() );
    }

    protected $file_headers = [
        'Cache-Control' => 'private, max-age=86400'
    ];

    public function file_pdf( $uuid )
    {
        return \Response::download( storage_path( 'app/files/' . $uuid . '.pdf' ), null, $this->file_headers, null );
    }

    public function file_image( $uuid )
    {
        try {
            return \Response::download(
                storage_path( 'app/previews/' . $uuid . '.png' ),
                null,
                $this->file_headers,
                null
            );
        } catch ( FileException $e ) {
            return \Response::download(
                storage_path( 'app/previews/_loading.gif' ),
                null,
                [
                    'Cache-Control' => 'no-cache, no-store, must-revalidate',
                    'Pragma'        => 'no-cache',
                    'Expires'       => '0'
                ],
                null
            );
        }
    }
}
