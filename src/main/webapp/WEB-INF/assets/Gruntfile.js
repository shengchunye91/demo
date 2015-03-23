module.exports = function(grunt) {
    grunt.initConfig({
        less : {
            compileLogin : {
                options : {},
                files : {
                    'css/login.css' : 'less/login.less'
                }
            },
            compileMain : {
                options : {
                    sourceMap : true,
                    outputSourceFiles : true,
                    sourceMapURL : 'main.css.map',
                    sourceMapFilename : 'css/main.css.map'
                },
                files : {
                    'css/main.css' : 'less/main.less'
                }
            },
            compileEnvelope : {
                options : {},
                files : {
                    'css/envelope.css' : 'less/envelope.less'
                }
            },
            minify : {
                options : {
                    cleancss : true,
                    report : 'min',
                    compress : true,
                    cleancssOptions : {
                        keepSpecialComments : 0,
                        keepBreaks : false
                    }
                },
                files : {
                    'css/login.min.css' : 'css/login.css',
                    'css/main.min.css' : 'css/main.css',
                    'css/envelope.min.css' : 'css/envelope.css'
                }
            }
        },
        watch : {
            less : {
                files : [ 'less/*.less', 'less/*/*.less' ],
                tasks : [ 'less' ]
            }
        },
        requirejs : {
            compileMain : {
                'options' : {
                    'baseUrl' : './',
                    'paths' : {
                        'requirejs' : 'lib/require',
                        'text' : 'lib/text',
                        'jquery' : 'lib/jquery',
                        'underscore' : 'lib/underscore',
                        'backbone' : 'lib/backbone',
                        'bootstrap' : 'lib/bootstrap',
                        'slimscroll' : 'lib/jquery.slimscroll',
                        'autocomplete' : 'lib/jquery.autocomplete',
                        'pnotify' : 'lib/pnotify',
                        'jquery.ui.widget' : 'lib/upload/jquery.ui.widget',
                        'fileupload' : 'lib/upload/jquery.fileupload',
                        'pagination' : 'js/pagination',
                        'notify' : 'js/notify',
                        'moment' : 'lib/moment',
                        'moment.tz' : 'lib/moment.tz',
                        'allassets' : 'js/allassets',
                        'collections' : 'js/collections',
                        'personReport' : 'js/personReport',
                        'documentReport' : 'js/documentReport',
                        'users' : 'js/users',
                        'companies' : 'js/companies',
                        'myprofile' : 'js/myprofile',
                        'adduser' : 'js/adduser'
                    },
                    'include' : [ 'requirejs', 'text', 'jquery', 'underscore', 'backbone', 'moment', 'moment.tz',
                            'bootstrap', 'slimscroll', 'pnotify', 'notify', 'jquery.ui.widget', 'fileupload',
                            'pagination', 'autocomplete', 'allassets', 'collections', 'personReport', 'documentReport',
                            'users', 'companies', 'myprofile', 'adduser','text!views/allassets.html',
                            'text!views/collections.html', 'text!views/companies.html',
                            'text!views/documentreporting.html', 'text!views/myprofile.html',
                            'text!views/personreporting.html', 'text!views/users.html', 'text!views/adduser.html'],
                    'out' : 'build/mainlibs.js'
                }
            },
            compileEnvelope : {
                'options' : {
                    'baseUrl' : './',
                    'paths' : {
                        'requirejs' : 'lib/require',
                        'jquery' : 'lib/jquery',                       
                        'pnotify' : 'lib/pnotify',
                        'notify' : 'js/notify'
                    },
                    'include' : [ 'requirejs', 'jquery','pnotify','notify'],
                    'out' : 'build/envelopelibs.js'
                }
            }
        },
        uglify : {
            all : {
                files : {
                    'js/main.min.js' : [ 'js/main.js' ],
                    'js/envelope.min.js' : [ 'js/envelope.js' ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [ 'less', 'watch' ]);
    grunt.registerTask('buildAll', [ 'less', 'requirejs', 'uglify' ]);
};
