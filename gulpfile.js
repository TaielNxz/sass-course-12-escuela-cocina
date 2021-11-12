// Gulp
const { src, dest, watch, series } = require('gulp');

// CSS
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// HTML
const htmlmin = require('gulp-htmlmin');

// JavaScript
const gulp = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const concat = require('gulp-concat');

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


function css( done ) {
    src('src/css/*.css')
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( dest( 'build/css' ) );
    
    done()
}

function html() {
    const options = { 
        collapseWhitespace: true, 
        removeComments: true 
    }
    return src('*.html')
        .pipe( htmlmin( options ))
        .pipe( dest('build') );
}

function js() { 
    return gulp.src('src/js/*.js')
        .pipe( concat('app.js') )  
        .pipe( babel({
            presets: ['@babel/env']
        }) )
        .pipe( terser() )  
        .pipe( gulp.dest('./build/js') )    
}

function images() {
    return src('src/img/*')
        .pipe( imagemin() )
        .pipe( dest('build/img') );
}

function imagesWebp() {
    const options = {
        quality: 50
    }
    return src('src/img/*.{png,jpg}')
        .pipe( webp( options ) )
        .pipe( dest('build/img') )
}

function imagesAvif() {
    const options = {
        quality: 50
    }
    return src('src/img/*.{png,jpg}')
        .pipe( avif( options ) )
        .pipe( dest('build/img'))
}

function dev() {
    watch( 'src/css/*.css', css );
    watch( 'src/js/*.js', js );
    watch( '*.html', html );
    watch( 'src/img/*', images );
}

exports.css = css;
exports.dev = dev;
exports.html = html;
exports.js = js;
exports.images = images;
exports.imagesWebp = imagesWebp;
exports.imagesAvif = imagesAvif;
exports.default = series( images, imagesWebp, imagesAvif, js, html, css, dev );