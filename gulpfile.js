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

gulp.task('compressImgs', function() {
    return gulp.src(["./img/**/*.jpg"], { base: "./img"})
    .pipe(image())
    .pipe(gulp.dest("./dist/img"))
});

gulp.task('spriteAvatars', ['compressImgs'], function() {
    var spriteData = 
        gulp.src('./dist/img/avatars/*.jpg') // source path of the sprite images
            .pipe(spriteSmith({
                imgPath: '../img/avatars/sprite.jpg',
                imgName: 'sprite.jpg',
                cssName: 'avatar.css',
                padding: 2
            }));

    spriteData.img.pipe(gulp.dest('./dist/img/avatars')); // output path for the sprite
   return spriteData.css.pipe(gulp.dest('./css')); // output path for the CSS
});


gulp.task('concatCSS', ['spriteAvatars'], function() {
   return gulp.src([
       'css/normalize.css',
       'css/foundation.css',
       'css/basics.css', 
       'css/menu.css',
       'css/hero.css',
       'css/photo-grid.css',
       'css/modals.css',
       'css/footer.css',
       'css/avatar.css'])
        .pipe(concat("styles.css"))
        .pipe(gulp.dest("css"));
});

gulp.task('minifyCSS', ['concatCSS'], function() {
    return gulp.src('css/styles.css')
     .pipe(cleanCSS())
     .pipe(rename("styles.min.css"))
     .pipe(gulp.dest("css"));
});

gulp.task('concatScripts',  function() {
   return gulp.src([
        'js/jquery.js',
        'js/fastclick.js',
        'js/foundation.js',
        'js/foundation.equalizer.js',
        'js/foundation.reveal.js'])
    .pipe(maps.init())
    .pipe(concat("scripts.js"))
    .pipe(maps.write("./"))
    .pipe(gulp.dest("js"));
}); 

gulp.task('minifyScripts', ['concatScripts'], function() {
   return gulp.src("js/scripts.js")
    .pipe(uglify())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("js"));
});


gulp.task('tidyHTML', function() {
   gulp.src('index.html') 
    .pipe(htmltidy())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    del(['dist', 'js/scripts*.js*', 'imgs/**']);
})

gulp.task('build',['tidyHTML', 'minifyCSS', 'minifyScripts'], function() {
    gulp.src(["css/styles.css", "css/styles.min.css", "js/scripts.js",
            "js/scripts.min.js"], { base: './'} )
        .pipe(gulp.dest('dist'));
    
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
}); 