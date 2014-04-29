var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cp = require('child_process');

var paths = {
	components: ['components/**/*', 'lib/**/*', 'component.json', 'app/*'],
    pages: 'pages/**/*',
	build: 'build/*.*'
};

var server = null;



gulp.task('components',function () {	
    //spawn child process to execute "component build" system command
    cp.exec('component install',  function (err, stdout, stderr)
    {
        console.log('component install stdout: ' + stdout);
        console.log('component install stderr: ' + stderr);
        if(err)
        {
            console.log('component install error: ' + err);
        }

        else
        {
            cp.exec('component build', function (err, stdout, stderr)
            {
                console.log('component build stdout: ' + stdout);
                console.log('component build stderr: ' + stderr);
                if(err)
                {
                    console.log('component build error: ' + err);
                }
            });
        }
    });
});
gulp.task('uglify', function ()
{
	gulp.src('build/build.js')
	.pipe(uglify())
	.pipe(rename('build.min.js'))
	.pipe(gulp.dest('build-min/'));
});


gulp.task('server', function ()
{   
    if(server)
    {
        server.kill('SIGKILL');
    }
    server = cp.fork('server.js');
    server.on('error', function (err)
    {
        console.log('server error');
    });
});
gulp.task('watch',function (){
    gulp.watch(paths.components, ['components']);
    gulp.watch(paths.pages, ['components']);
    gulp.watch(paths.build, ['uglify']);
    gulp.watch('server.js', ['server'])
});

gulp.task('default', ['watch', 'components', 'server']);

//make sure that control-C kills the server process as well
process.on('SIGINT', function (){
    if(server)
    {
        server.kill('SIGKILL');
    }
    process.exit();
});
process.on('uncaughtException', function ()
{
    if(server)
    {
        server.kill('SIGKILL');
    }
});