module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat:  {
            options: {
                seperator: ';'
            },
            dist: {
                src: ['app/**/*.js'],
                dest: 'public/scripts/app.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'app/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ["public/stylesheets"],
                    yuicompress: true
                },
                files: {
                    "public/stylesheets/index.css": "public/stylesheets/index.less",
                    "public/stylesheets/home.css": "public/stylesheets/home.less"
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, flatten: true, src: ['app/partials/*'], dest: 'public/partials'}

                ]
            }
        },
        watch: {
            files: ['<%= jshint.files %>','tests/**/*Spec.js','app/**/*','public/stylesheets/*.less'],
            tasks: ['jshint','concat' ,'less','copy']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['jshint','concat','less']);
};