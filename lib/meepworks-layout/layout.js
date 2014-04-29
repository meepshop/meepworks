var react = require('react');
var core = require('meepworks-core');


var dom = react.DOM;


var meepLayouts = module.exports = {
	magic: core.createClass({	//implement later... require lots of refactoring and work
		getDefaultProps: function ()
		{
			return {
				content: []
			}
		},
		render: function ()
		{
			return dom.div({
				className:"magic-layout isotope"
			});
		}
	})
};





function reference(){

	/**
	 * Transition Layout - generate layout like a pagination with transition
	 */
	$(function(){
		var active_layout = $('.transition-layout.active').length;
		if (active_layout === 0) {
			$('.transition-layout').first().addClass('active');
		}
	});
	$('[data-toggle="transition-layout"]').on('click', function(e){
		e.preventDefault();

		var $this = $(this),
			parents = $('[data-toggle="transition-layout"]'),
			layouts = $('.transition-layout'),
			active_layout = $('.transition-layout.active'),
			target = $this.attr('href'),
			current = $(target).hasClass('active'),
			anim = $this.attr('data-anim'),
			In = 'scaleIn',
			Out = 'scaleOut';

			/** remove this command if you use slide effect for transition layout
			if (anim == 'slide') {
				In = 'scaleIn';
				Out = 'scaleOut';
			};
			*/

		if (parents.hasClass('btn')) {
			parents.removeClass('active');
			$(this).addClass('active');
		}
		else{
			parents.parent().removeClass('active');
			$(this).parent().addClass('active');
		}
		

		if (target.length !== 0) {
			if (!current) {
				// layouts.unbind();

				layouts.removeClass('active scaleIn scaleOut slideIn slideOut');

				active_layout.addClass(Out);

				$(target).addClass('active '+In);
					/*.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
						$(target).addClass('active')
					});*/
			};
		};
	})



	/**
	 * Magic Layout - generate with isotope 
	 * it's a awesome responsive layout for your awesome projects
	 * bootstrap is available grid layout, but static
	 * magic layout give you dynamically responsive layout for differents viewport
	 */
	// init magic layout with isotope
	$('.magic-layout').each(function(){
		var $container = $(this),
			parent = $container.parent(),
			data_col = $container.attr('data-cols'),
			viewport = $.viewportW(),
			cols, masonry;

		if(typeof data_col === undefined || data_col == '' ){
			data_col = 2;
		}

		if(data_col == '3'){
			cols = 'ml-col-3';
		}
		else if(data_col == '4'){
			cols = 'ml-col-4';
		}
		else{
			data_col = 2;
		}

		if (viewport <= 1280) {
			if (data_col > 2) {
				cols = '';
				data_col = 2;
			}
		}

		// add class for layout col
		$container.addClass(cols);

		// initialize masonry width
		masonry = $container.width() / data_col;

		$container.isotope({
		  itemSelector : '.magic-element',
		  // disable normal resizing
		  resizable: false, 
		  // set columnWidth to a percentage of container width
		  masonry: { columnWidth: masonry }
		});

		// update fixed with transition layout
		setTimeout(function(){
			masonry = $container.width() / data_col;
			// initialize Isotope
			$container.isotope({
			  // set columnWidth to a percentage of container width
			  masonry: { columnWidth: masonry }
			});
		}, 500);
		
		// update fixed with transition layout
		$('.transition-layout').bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
			masonry = $container.width() / data_col;
			// initialize Isotope
			$container.isotope({
			  // set columnWidth to a percentage of container width
			  masonry: { columnWidth: masonry }
			});
		})

		// update initialize if transition is running
		$("#content-aside").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			var masonry = $container.width() / data_col;
			// initialize Isotope
			$container.isotope({
			  // set columnWidth to a percentage of container width
			  masonry: { columnWidth: masonry }
			});
		})

		// update columnWidth on window resize
		$(window).on('resize', function(){
			var viewport = $.viewportW();	// detect viewport with verge
			
			// if toggle aside in mode medium to small viewport
			if (viewport <= 1280) {
				if (data_col > 2) {
					cols = '';
					data_col = 2;
				}
			}
			else{
				// set to original data
				data_col = $container.attr('data-cols');
				if(typeof data_col === undefined || data_col == '' ){
					data_col = 2;
				}

				if(data_col == '3'){
					cols = 'ml-col-3';
				}
				else if(data_col == '4'){
					cols = 'ml-col-4';
				}
				else{
					data_col = 2;
				}
			}

			// update class
			$container.removeClass('ml-col-3 ml-col-4');
			$container.addClass(cols);

			// update masonry
			masonry = $container.width() / data_col;

			// update on resize
		  	$container.isotope({
			    // update columnWidth to a percentage of container width
			    masonry: { columnWidth: masonry }
		  	});

		  	// update columnWith after transition finished
			$("#content").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
				masonry = $container.width() / data_col;
				$container.isotope({
				    // update columnWidth to a percentage of container width
				    masonry: { columnWidth: masonry }
			  	});
			})
		}); // end window resize

		// update columnWidth on toggle aside
		$('#toggle-aside').on('click', function(e){
			$container.isotope('reLayout');
			
		}) // end toggle aside

		// update columnWidth on toggle aside
		$('#toggle-content').on('click', function(e){
			masonry = $container.width() / data_col;
			$container.isotope({
			    // update columnWidth to a percentage of container width
			    masonry: { columnWidth: masonry }
		  	});
		}) // end toggle content

		// update columnWidth on avtive content swipe
		$('#content[data-swipe="true"]').on('swipe', function(){
			masonry = $container.width() / data_col;
			$container.isotope({
			    // update columnWidth to a percentage of container width
			    masonry: { columnWidth: masonry }
		  	});
		})
	}) // end each magic-layout
	

	
	// panel controls
	// callback panel on finish actions
	var callback_panel = function(){
		$('.magic-layout').isotope('reLayout');
	};
	$('[data-toggle="tab"], [data-toggle="collapse"]').on('click', function(){
		var $this = $(this),
			target = $this.attr('href');

		$(target).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			callback_panel();
		});
	})
	// close a panel
	$('.panel [data-close]').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			panel = $this.attr('data-close');

		$(panel).hide(300, function(){
			$('.magic-layout').isotope('remove', $(this));
		});
	});
	// collapse a panel
	$('.panel-collapsed .panel-body').hide(100, callback_panel);
	$('.panel-collapsed .table').hide(100, callback_panel);
	$('.panel-collapsed .list-group').hide(100, callback_panel);
	$('.panel [data-collapse]').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			panel = $this.attr('data-collapse'),
			panel_body = $(panel).children('.panel-body'),
			table = $(panel).children('.table'),
			list_group = $(panel).children('.list-group');

		$(panel).toggleClass('panel-collapsed');
		$(panel_body).slideToggle(200, callback_panel);
		$(table).slideToggle(200, callback_panel);
		$(list_group).slideToggle(200, callback_panel);
	});
	$('[data-toggle="panel-collapse"]').on('dblclick', function(e){
		e.preventDefault();
		var $this = $(this),
			panel = $this.attr('data-panel'),
			panel_body = $(panel).children('.panel-body'),
			table = $(panel).children('.table'),
			list_group = $(panel).children('.list-group');

		$(panel).toggleClass('panel-collapsed');
		$(panel_body).slideToggle(200, callback_panel);
		$(table).slideToggle(200, callback_panel);
		$(list_group).slideToggle(200, callback_panel);
	});
	$('.panel > .panel-heading > .panel-icon').on('dblclick', function(e){
		e.preventDefault();
		var $this = $(this),
			panel = $this.parent().parent(),
			panel_body = panel.children('.panel-body'),
			table = panel.children('.table'),
			list_group = panel.children('.list-group');

		panel.toggleClass('panel-collapsed');
		panel_body.slideToggle(200, callback_panel);
		table.slideToggle(200, callback_panel);
		list_group.slideToggle(200, callback_panel);
	});
	// expand panel
	$('.panel [data-expand]').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			panel = $this.attr('data-expand');

		$(panel).toggleClass('expand');
		callback_panel();
	});
	// refresh panel
	$('.panel [data-refresh]').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			panel = $this.attr('data-refresh');

		$(panel).append('<div class="panel-progress"><div class="panel-spinner"></div></div>');


		// Your ajax place here to remove panel-progress, we just use setTimeout to simple demo
	})
	$('.close').on('click', function(){
		callback_panel();
	});
}