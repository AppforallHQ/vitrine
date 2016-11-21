var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'public/static', src: ['fonts/*'], dest: 'public/dist/'},
                ]
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'public/static',
                    src: 'images/*.{png,jpg,gif,svg}',
                    dest: 'public/dist/'
                }]
            }
        },
        uglify: {
            build: {
                files: {
                    'public/dist/js/script.min.js': [
                        'public/static/js/jquery-1.9.1.min.js',
                        'public/static/js/analytics.js',
                        'public/static/js/devicecheck.js',
                        'public/static/js/flipclock.min.js',
                        'public/static/js/getappdata.js',
                        'public/static/js/register.js',
                        'public/static/js/fontfaceobserver.js',
                        'public/static/js/script.js',
                        'public/static/js/subscription.js',
                        'public/static/js/track.js',
                    ]
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/static/css',
                    src: ['*.css'],
                    dest: 'public/dist/css',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            css: {
                files: ['public/static/css/*.css'],
                tasks: ['cssmin']
            },
            js: {
                files: ['public/static/js/*.js'],
                tasks: ['uglify']
            }
        },
        nodemon: {
            dev: {
                script: 'boot.js'
            }
        }, 
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('default', ['copy', 'imagemin', 'cssmin', 'uglify']);
};
