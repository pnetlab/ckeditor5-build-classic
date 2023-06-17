/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';

import widgetRegister from './widgetRegister';

/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MagicWidget extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MagicWidget'; 
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this._registerSchema();
		this._registerConverters();
		if(!this.editor['magicwidget_selected']) this.editor['magicwidget_selected']={};
		if(!this.editor['magicwidget_balloon']) this.editor['magicwidget_balloon'] = {};
		
		this.editor.editing.view.document.on('keydown', (event, dom)=>{
			var evt = dom.domEvent;
			if(evt.code == 'Space'){
				if(evt.ctrlKey){
					var position = this.editor.editing.view.document.selection.getFirstPosition();
					var nextWidgetView = findParent(position, (element)=>{return element.hasClass('magic_widget','editing')});
					var nextWidgetModel = this.editor.editing.mapper.toModelElement(nextWidgetView);
					if(!nextWidgetModel) return;
					nextWidgetModel['magicwidget_factory']._selectWidget(nextWidgetView, null, evt);

				} 
			}
		
		});

		this.editor.editing.view.document.on('mouseup', (event, dom)=>{
			
			if(!this.editor.widgetResizing) return;
			
			var de = this.editor.widgetResizing.de;
			var ve = this.editor.widgetResizing.ve;
			var me = this.editor.editing.mapper.toModelElement(ve);
			if(!me) return;
			var options = this.editor.widgetResizing.options;
			this.editor.widgetResizing = null;

			var wunit = get(me.getAttribute('wunit'), 'px');
			var hunit = get(me.getAttribute('hunit'), 'px');

			var parentNode = $(de.parentNode)

			var parentWidth = parentNode.width();
			var parentHeight = parentNode.height();

			var width = de.offsetWidth;
			var height = de.offsetHeight;

			if (wunit == '%') {
				width = Math.ceil(width * 100 / parentWidth);
				if (width > 100) width = 100;
			}
			if (hunit == '%') {
				height = Math.ceil(height * 100 / parentHeight);
				if (height > 100) height = 100;
			}

			if (options['resize'] == 'horizontal') height = '';
			if (options['resize'] == 'vertical') width = '';

			
			me['magicwidget_factory']._resize(width, wunit, height, hunit, ve, me);

			var parent = ve.parent;
			if (parent.name == 'td') {
				this.editor.editing.view.change(writer => {
					writer.removeStyle('width', parent)
				})
			}

			
		});
		
	}
	
	_registerSchema() {
		
	}
	
	_registerConverters() {
		const editor = this.editor;
		
		editor.data.upcastDispatcher.on( 'element', ( evt, data, conversionApi ) => {
			
			if(data.viewItem.hasClass('magic_widget')){
				
				const { consumable, schema, writer } = conversionApi;
				var viewElement = data.viewItem;
				var widthStyle = /(\d+)(\D+)/.exec(viewElement.getStyle( 'width' ));
		    	var heightStyle = /(\d+)(\D+)/.exec(viewElement.getStyle( 'height' ));
		    	
		    	if(!widthStyle) widthStyle = [];
		    	if(!heightStyle) heightStyle = [];
		    	
		    	var sizeData = {
		    			width: get(widthStyle[1],''), 
			        	height: get(heightStyle[1],''), 
			        	wunit: get(widthStyle[2],''),
			        	hunit: get(heightStyle[2],''), 
		    	}
		    	
		    	for ( const item of data.modelRange.getItems( { shallow: true } ) ) {
		            if ( schema.checkAttribute( item, 'margic_widget' )) {
		                writer.setAttributes( sizeData, item );
		            }
		        }
			}
		} , { priority: 'lowest' } );
		
	}
	
}





