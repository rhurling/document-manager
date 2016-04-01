<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'files',
            function ( Blueprint $table ) {
                $table->increments( 'id' );
                $table->nullableTimestamps();
                $table->unsignedInteger( 'user_id' );
                $table->string( 'uuid' );
                $table->string( 'title' );
                $table->longText( 'content' )->nullable();

                $table->unique( 'uuid' );
                $table->engine = 'MyISAM';
            }
        );

        DB::statement( 'ALTER TABLE files ADD FULLTEXT search(title, content)' );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table(
            'files',
            function ( Blueprint $table ) {
                $table->dropIndex( 'search' );
            }
        );
        Schema::drop( 'files' );
    }
}
