$(document).ready(function() {
    'use strict';

    if ( typeof Object.create !== 'function' ) {
    	Object.create = function( obj ) {
    		function F() {}
    		F.prototype = obj;
    		return new F();
    	};
    }

    (function($) {
        var Lightbox = {
            init: function(options, elem) {
                var self = this;

                self.$elem = $(elem);
                self.options = $.extend({}, $.fn.lightbox.defaults, options);

                self.response();
                self.setup();
                self.responsive();
            },

            setup: function() {
                var self = this, intvalId;

                self.active = true;
                self.windowHeigth = window.innerHeight || $(window).height();
                self.windowWidth  = window.innerWidth  || $(window).width();

                //Checks if the overlay and lightbox divs exists, so not to recreate them over and over again.
                if(!$('#overlay').length && !$('#lightbox').length) {
                    self.createOverlay();
                    self.createLightbox();
                }

                if(typeof self.options.controls === "boolean" && self.options.controls && !$('#controls-left').length) {
                    if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                        self.createControls();
                    }
                }

                self.getSource();
                self.display();
            },

            /**
             * Make sure the response option value isn't below a certain value.
             * The default value is 10
             */
            response: function() {
                var self = this, response = self.options.response;
                if(response < 10) {
                    response = 10;
                }
            },

            responsive: function() {
                var self = this, intvalId;

                $(window).resize(function() {
                    if(self.active) {
                        var intval = function () {
                            self.removeImage();
                            self.setup();
                        };
                        clearTimeout(intvalId);
                        intvalId = setTimeout(intval, self.options.response);
                    }
                });
            },

            createOverlay: function() {
                var self = this, options = self.options;

                $('<div></div>')
                    .attr('id', 'overlay')
                    .animate({'opacity': options.opacity}, options.showDuration)
                    .appendTo('body')
                    .click(function() {
            	         self.removeLightbox();
            	    });
            },

            createLightbox: function() {
                $('<div></div>')
                    .attr('id', 'lightbox')
                    .hide()
                    .appendTo('body');
            },

            createControls: function() {
                var self = this, controls = ['left', 'right'];

                for(var i = 0; i < controls.length; i++) {
                    $('<div></div>')
                        .attr('id', controls[i])
                        .attr('class', 'controls')
                        .append('<div class="control-arrow"><i class="fa fa-arrow-circle-' + controls[i] + ' fa-5x"></i></div>')
                        .appendTo('body');
                }

                $('div.controls')
                    .on('click', function() {
                        self.changeImage($(this).attr('id'));
                    });
            },

            removeLightbox: function() {
                var self = this;
                $('#overlay, #lightbox, #left, #right')
                    .fadeOut(self.options.hideDuration, function() {
                        $(this).remove();
                    });

                $('body').css({'overflow': 'visible'});
                self.active = false;
            },

            removeImage: function() {
                $('#lightbox').find('#img').remove();
            },

            getImageWithId: function(id) {
                return $('.gallery .img-container').find('img[data-id=' + id + ']');
            },

            getSource: function() {
                var self = this, extImgSrc = self.options.externalImageSource;

                self.src = self.$elem.attr('src');
                if(self.$elem.attr(extImgSrc)) {
                    self.src = self.$elem.attr(extImgSrc);
                }
            },

            display: function() {
                var self = this;

                $('body').css({'overflow': 'hidden'});

                $('<img id="img">')
                    .attr('src', self.src)
                    .css({
                        'max-height': self.windowHeigth,
                        'max-width': self.windowWidth
                    })
                    .load(function () {
                    $('#lightbox')
                        .css({
                            'top': (self.windowHeigth - $('#lightbox').height()) / 3,
                            'left': (self.windowWidth - $('#lightbox').width()) / 2
                        })
                        .fadeIn(self.options.showDuration);
                    })
                    .click(function() {
                        self.removeLightbox();
                    })
                    .appendTo('#lightbox');
            },

            changeImage: function(direction) {
                var self = this, currentId = parseInt(self.$elem.attr('data-id')), nrOfImages = $('.gallery .img-container').find('img:last-child').attr('data-id');

                if(direction === "left") {
                    if(currentId - 1 < 0) {
                        self.$elem = self.getImageWithId(nrOfImages);
                    } else {
                        self.$elem = self.getImageWithId(currentId - 1);
                    }
                } else if(direction === "right") {
                    if(currentId + 1 > nrOfImages) {
                        self.$elem = self.getImageWithId(0);
                    } else {
                        self.$elem = self.getImageWithId(currentId + 1);
                    }
                }

                self.removeImage();
                self.setup();
            },
        };

        $.fn.lightbox = function(options) {
            return this.each(function() {
                var lightbox = Object.create(Lightbox);
                lightbox.init(options, this);
            });
        };

        $.fn.lightbox.defaults = {
            'showDuration': 'fast', //The duration of the show animation of the lightbox
            'hideDuration': 'slow', //The duration of the hide animation of the lightbox
            'externalImageSource': 'data-src', //Makes it possible to load the same picture with a higher resolution. Set a <img src="" data-src="">
            'controls': true, //If the lightbox should show controls or not
            'response': 250, //How often the responsive functions will run.
            'opacity': 1, //How dark the background will be when the lightbox is active, 1 is black and 0 is no background.
        };
    }) (jQuery);
});
