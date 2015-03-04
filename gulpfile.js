var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    notify = require("gulp-notify"),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    fileinclude = require('gulp-file-include'),
    connect = require('gulp-connect'),
    //livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    opn = require('opn');

var config = {
    outputDir: './boast',
    srcPath: './src',
    sassPath: './src/sass',
    jsPath: './src/js',
    vendorPath: './src/vendor',
    fontsDir: './src/fonts',
    imgDir: './src/img',
    bowerDir: './bower_components',
}

gulp.task('connect', function() {
    connect.server({
        root: config.outputDir,
        port:8002,
        open: {
            browser: 'Google Chrome'
        },
        livereload: true
    });
});

gulp.task('bower', function() {
    return bower().pipe(gulp.dest(config.bowerDir))
});

gulp.task('fonts', function() {
    return gulp.src(config.fontsDir + '/**.*')
        .pipe(gulp.dest('./boast/assets'));
});

gulp.task('images', function() {
    return gulp.src(config.imgDir + '/**.*')
        .pipe(gulp.dest('./boast/assets'));
});

gulp.task('vendor_css', function() {
    //return sass(config.bowerDir + '/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss', {
    return sass(config.sassPath + '/vendor.scss', {
        loadPath: [
            config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
        ]
    })
        .pipe(gulp.dest('./boast/assets'));
});

gulp.task('vendor_js', function() {
    return gulp.src([config.bowerDir + '/jquery/dist/jquery.js', config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js', config.vendorPath + '/js/**.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./boast/assets'));
});

gulp.task('css', function() {
    return sass(config.sassPath + '/style.scss', {
        sourcemap: false
    })
        .pipe(gulp.dest('./boast/assets'))
        //.pipe(livereload());
        //.pipe(connect.reload());
});

gulp.task('js', function() {
    return gulp.src([config.jsPath + '/**.js'])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./boast/assets'))
        //.pipe(livereload());
	    //.pipe(connect.reload());

});


gulp.task('include', function() {
    gulp.src(['./src/**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                name: 'example'
            }
        }))
        .pipe(gulp.dest('./boast'))
        //.pipe(connect.reload());
});

var server = {
  host: 'localhost',
  port: '8000'
}

gulp.task('webserver', function() {
  gulp.src( config.outputDir )
    .pipe(webserver({
      host:             server.host,
      port:             server.port,
      livereload:       true,
      directoryListing: false
    }));
});

gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port );
});

gulp.task('watch', ['connect'], function() {
    //livereload.listen();
    gulp.watch(config.jsPath + '/**/*.js', ['js']);
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    gulp.watch(config.srcPath + '/**/*.html', ['include']);
    gulp.watch(config.imgPath + '/**/*', ['images']);
});
gulp.task('default', ['bower', 'css', 'js', 'images', 'include', 'connect', 'watch']);
gulp.task('build', ['bower', 'fonts', 'vendor_css', 'css',  'js', 'watch', 'connect']);
gulp.task('dev', ['include', 'css',  'js','webserver', 'watch', 'openbrowser']);
