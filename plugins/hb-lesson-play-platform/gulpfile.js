require('./build/config/config')
require('./build/serve-dev')
require('./build/serve-design')
require('./build/serve-dist')
const $ = require('gulp-load-plugins')()
const taskLoader = require('./build/tasks/tasks-loader')
const through2 = require('through2')
const del = require('del')

let gulp = require('gulp')

let matches = {
    less: `${env.dev.options.dir}/**/webstyle.less`,
    js: `${env.dev.options.dir}/**/*.js`,
    html: `${env.dev.options.dir}/**/*.html`
}

gulp.task('css:less', () => {
    return cssLess().pipe(gulp.dest('./.temp'))
})

function cssLess () {
    return gulp.src(matches.less)
        .pipe($.less())
        .pipe($.autoprefixer())
}

function jsUglify () {
    return gulp.src(matches.js)
        .pipe($.removelogs())
        .pipe($.ngAnnotate())
        .pipe($.uglify({ie8: true}))
}

function htmlMin () {
    return gulp.src(matches.html)
        .pipe($.htmlmin({collapseWhitespace: true, removeComments: true}))
}

function otherFiles () {
    return gulp.src([
        `${env.dev.options.dir}/**/*.*`,
        `!${matches.less}`,
        `!${matches.js}`,
        `!${matches.html}`
    ])
}

const noop = function () {
}

gulp.task('default', ['bowerSolution'], () => {

    let promises = []
    let files = []

    function __pusher (piper) {
        return new Promise((res, rej) => {
            piper
                .pipe(through2.obj(function (file, enc, next) {
                    files.push(file)
                    next()
                }))
                .on('data', noop)
                .on('end', function (er) {
                    res()
                })
        })
    }

    promises.push(__pusher(cssLess()))
    promises.push(__pusher(jsUglify()))
    promises.push(__pusher(htmlMin()))
    promises.push(__pusher(otherFiles()))

    return del([
        `${env.dist.options.dir}/**`
    ]).then(function () {
        return new Promise((res, rej) => {
            Promise.all(promises)

                .then(function () {
                    return gulp.src('')

                        .pipe(through2.obj(function (file, enc, next) {
                            files.forEach(($file) => {
                                this.push($file)
                            })
                            next()
                        }))

                        .pipe(taskLoader.hashFile())

                        .pipe(gulp.dest(`${env.dist.options.dir}`))

                        .on('end', function () {
                            res()
                        })
                })
        })
    })
})