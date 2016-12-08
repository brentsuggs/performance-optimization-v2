'use strict'; 

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
  htmltidy = require('gulp-htmltidy'),
    rename = require('gulp-rename'),
       del = require('del'),
  cleanCSS = require('gulp-clean-css'),
      maps = require('gulp-sourcemaps'),
     image = require('gulp-image'),
spriteSmith = require('gulp.spritesmith'); 

var options = {
    src: './src/',
    dist: './dist/'
};

gulp.task('compressImgs', ['spriteAvatars'], function() {
    return gulp.src([options.src + "img/**/*.jpg", options.src + "img/avatars/sprites.png"], { base: options.src + "img"})
    .pipe(image())
    .pipe(gulp.dest(options.dist + "img"))
});

gulp.task('spriteAvatars',  function() {
    var spriteData = 
        gulp.src(options.src + 'img/avatars/*.png') // source path of the sprite images
            .pipe(spriteSmith({
                imgPath: '../img/avatars/sprites.png',
                imgName: 'sprites.png',
                cssName: 'avatar.css',
                padding: 2
            }));

    spriteData.img.pipe(gulp.dest(options.dist + 'img/avatars')); // output path for the sprite
   return spriteData.css.pipe(gulp.dest(options.src + 'css')); // output path for the CSS
});


gulp.task('concatCSS', ['clean','compressImgs'], function() {
    del(options.src + 'css/styles*.css' );
   return gulp.src([
       options.src + 'css/normalize.css',
       options.src + 'css/foundation.css',
       options.src + 'css/basics.css', 
       options.src + 'css/menu.css',
       options.src + 'css/hero.css',
       options.src + 'css/photo-grid.css',
       options.src + 'css/modals.css',
       options.src + 'css/footer.css',
       options.src + 'css/avatar.css'])
        .pipe(concat("styles.css"))
        .pipe(gulp.dest(options.src + "css"));
});

gulp.task('minifyCSS', ['concatCSS'], function() {
    return gulp.src(options.src + 'css/styles.css')
     .pipe(cleanCSS())
     .pipe(rename("styles.min.css"))
     .pipe(gulp.dest(options.src + "css"));
});

gulp.task('concatScripts',  function() {
    del(options.src + 'js/scripts*.js*' );
   return gulp.src([
        options.src + 'js/jquery.js',
        options.src + 'js/fastclick.js',
        options.src + 'js/foundation.js',
        options.src + 'js/foundation.equalizer.js',
        options.src + 'js/foundation.reveal.js'
   ])
    .pipe(maps.init())
    .pipe(concat("scripts.js"))
    .pipe(maps.write(options.src))
    .pipe(gulp.dest(options.src + "js"));
}); 

gulp.task('minifyScripts', ['concatScripts'], function() {
   return gulp.src(options.src + "js/scripts.js")
    .pipe(uglify())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest(options.src + "js"));
});


gulp.task('tidyHTML', function() {
   gulp.src(options.src + 'index.html') 
    .pipe(htmltidy())
    .pipe(gulp.dest(options.dist));
});

//move files to optimization testing folder
//gulp.task('move', function() {
//   gulp.src('./dist/**/*', { base: './dist'} ) 
//   .pipe(gulp.dest('C:/Users/bsuggs/Documents/GitHub/optimization-testing-master/public/'));
//});

gulp.task('clean', function() {
    del([options.dist]);
})

gulp.task('build',['tidyHTML', 'minifyCSS', 'minifyScripts'], function() {
    gulp.src([options.src + "css/styles.css", options.src + "css/styles.min.css", options.src + "js/scripts.js",
            options.src + "js/scripts.min.js"], { base: options.src} )
        .pipe(gulp.dest(options.dist));
    
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
}); 