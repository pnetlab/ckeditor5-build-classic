/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import ListView from '@ckeditor/ckeditor5-ui/src/list/listview';

import {InsertBoxCommand, InsertRowCommand, InsertColCommand} from './commands/insertgridcommand';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ResponsiveCtrl from './ui/ResponsiveCtrl';

import magicWidgetRegister from '../ckeditor_magicwidget/widgetRegister';
import MagicWidgetFactory from '../ckeditor_magicwidget/widgetFactory';
import React, { Component } from 'react'
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BootstrapGrid extends Plugin {
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
		return 'BootstrapGrid';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this._registerSchema();
		this._registerConverters();
		
		magicWidgetRegister(this.editor, 'row');
		magicWidgetRegister(this.editor, 'column');
		magicWidgetRegister(this.editor, 'box');
		
		editor.commands.add( 'insertRow', new InsertRowCommand(editor) );
		editor.commands.add( 'insertCol', new InsertColCommand(editor) );
		editor.commands.add( 'insertBox', new InsertBoxCommand(editor) );
		
		editor.ui.componentFactory.add( 'insertGrid', locale => {
			
			const dropdownView = createDropdown( locale );
            
            // Decorate dropdown's button.
            dropdownView.buttonView.set( {
                label: t( 'Grid' ),
                tooltip: true,
                withText: true,
                class: 'ck-button__label__fit', 
                 
            } );
			
			
            const insertRowCommand = editor.commands.get( 'insertRow' );
            const rowButtonView = new ButtonView( locale );
            rowButtonView.set( {
                label: t( 'Insert Row' ),
                withText: true,
                tooltip: true
            } );
            rowButtonView.bind( 'isEnabled' ).to( insertRowCommand,'isEnabled' );
            this.listenTo( rowButtonView, 'execute', () => editor.execute( 'insertRow' ) );
            
            
            const insertColCommand = editor.commands.get( 'insertCol' );
            const colButtonView = new ButtonView( locale );
            colButtonView.set( {
                label: t( 'Insert Column' ),
                withText: true,
                tooltip: true
            } );
            colButtonView.bind('isEnabled' ).to( insertColCommand,'isEnabled' );
            this.listenTo( colButtonView, 'execute', () => editor.execute( 'insertCol' ) );
            
            const insertBoxCommand = editor.commands.get( 'insertBox' );
            const boxButtonView = new ButtonView( locale );
            boxButtonView.set( {
            	label: t( 'Insert Box' ),
            	withText: true,
            	tooltip: true
            } );
            boxButtonView.bind('isEnabled' ).to( insertBoxCommand,'isEnabled' );
            this.listenTo( boxButtonView, 'execute', () => editor.execute( 'insertBox' ) );

            const itemDefinitions = new ListView(locale);
            itemDefinitions.items.add(rowButtonView);
            itemDefinitions.items.add(colButtonView);
            itemDefinitions.items.add(boxButtonView);
             
            dropdownView.panelView.children.add(itemDefinitions);
            
            return dropdownView;
            
		} );
		

		this.editor.editing.view.document.on('keydown', (event, dom)=>{
			var evt = dom.domEvent;
			if(evt.code == 'ArrowRight'){
				var selectElement = editor.model.document.selection.getSelectedElement();
                if(!selectElement) return;
                if(selectElement.name != 'box' && selectElement.name != 'row') return;
				if(selectElement.parent.getChildIndex(selectElement) < selectElement.parent.childCount - 1) return;
				
				this.editor.model.change(writer => {
					var start = writer.createPositionAfter(selectElement);
					writer.insertElement( 'paragraph', start);
				});
			}
		}, {priority:100000});
		
		
		
	}
	
	_registerSchema() {
		this.editor.model.schema.register( 'row', {
			allowIn:['column', '$root', 'box'],
			allowAttributes: [],
			allowContentOf: '$block',
			defaults: {paddingTop:'15px', paddingBottom:'15px', paddingLeft:'0px', paddingRight:'0px'},
			//isLimit: true,
			isObject: true,
			isBlock: true,
		});
		
		this.editor.model.schema.register( 'column', {
			allowIn: ['row'],
			allowAttributes: ['responsive', 'ratio', 'order'],
			allowContentOf: '$root',
			defaults: {paddingTop:'0px', paddingBottom:'0px', paddingLeft:'15px', paddingRight:'15px'},
			// isLimit: true,
			isObject: true,
			// isBlock: true,
		});
		
		
		this.editor.model.schema.register( 'box', {
			allowWhere: '$block',
			//allowIn: ['box', '$root'],
			allowAttributes: [],
			allowContentOf: '$root',
			defaults: {width:'100', wunit:'%'},
			// isLimit: true,
			isObject: true,
			// isBlock: true, 
		});
		
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */ 
	_registerConverters() {
		const editor = this.editor;

		// Dedicated converter to propagate table's attribute to the img tag.
		editor.conversion.for( 'dataDowncast' ).elementToElement( {
		    model: 'row',
		    view: ( modelElement, viewWriter ) => {
		        return viewWriter.createContainerElement( 'div', {class: 'row'} )
		    }
		} );
		
		editor.conversion.for( 'upcast' ).elementToElement( {
		    view: {
		        name: 'div',
		        classes: 'row'
		    },
		    model: ( viewElement, modelWriter ) => {
		    	
		        return modelWriter.createElement( 'row' );
		    }
		} );
		
		editor.conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'row',
            view: ( modelElement, viewWriter ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createContainerElement( 'div', {class: 'row'} );
                var widgetFactory = new MagicWidgetFactory(this.editor);
                var row = widgetFactory.make(viewWriter, modelElement, div, {resize: 'both', color:'#2196F3', editable:true});
                
               
                
                
                return row;
            }
        } );

		//====================================================================================
		editor.conversion.for( 'dataDowncast' ).elementToElement( {
		    model: 'column',
		    view: ( modelElement, viewWriter ) => {
		    	var responsive = modelElement.getAttribute('responsive');
		    	var ratio = modelElement.getAttribute('ratio');
		    	var order = modelElement.getAttribute('order');
		    	var className = 'column_item col';
		    	if(isset(responsive) && responsive !='' && isset(ratio) && ratio !='') className = className +'-'+responsive;
		    	if(isset(ratio) && ratio !='') className = className +'-'+ratio;
		    	if(isset(order) && order !='') className = className +' '+order;
		    	
		        return viewWriter.createContainerElement( 'div', {class: className} )
		    }
		} );
		
		editor.conversion.for( 'upcast' ).elementToElement( {
		    view: {
		        name: 'div',
		        classes: 'column_item'
		    },
		    model: ( viewElement, modelWriter ) => {
		    	var classNames = viewElement.getClassNames();
		    	var responsive = '';
		    	var ratio = '';
		    	var order = '';
		    	var m = null;
		    	for(var className of classNames){
		    		if ((m = /col-([\w]{2})-([\d]{1,2})/.exec(className)) !== null) {
		    			responsive = m[1];
		    			ratio = m[2];
		    			break;
		    		}
		    		if ((m = /col-([\d]{1,2})/.exec(className)) !== null) {
		    			responsive = '';
		    			ratio = m[2];
		    			break;
		    		}
		    	}
		    	
		    	classNames = viewElement.getClassNames();
		    	for(var className of classNames){
		    		if (/order/.test(className)){
		    			order = className; 
		    			break;
		    		}
		    	}
		    	
		    	
		        return modelWriter.createElement( 'column', { 
		        	padding: viewElement.getStyle('padding'),
		        	responsive: responsive,
		        	ratio: ratio,
		        	order: order,
		        } );
		    }
		} );
		
		editor.conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'column',
		    view: ( modelElement, viewWriter ) => {
		    	var responsive = modelElement.getAttribute('responsive');
		    	var ratio = modelElement.getAttribute('ratio');
		    	var order = modelElement.getAttribute('order');
		    	var className = 'column_item col';
		    	if(isset(responsive) && responsive !='' && isset(ratio) && ratio !='') className = className +'-'+responsive;
		    	if(isset(ratio) && ratio !='') className = className +'-'+ratio;
		    	if(isset(order) && order !='') className = className +' '+order;
		    	
		        var div = viewWriter.createContainerElement( 'div', {class: className} )
		       
		        var widgetFactory = new MagicWidgetFactory(this.editor);
		        
		        var col = widgetFactory.make(viewWriter, modelElement, div , {
		        	toolbar: <ResponsiveCtrl ref={comp => modelElement['toolBarExpand'] = comp} onChange={(values)=>{
		        		this.editor.model.change(writer=>{
		        			writer.setAttributes(values, modelElement)
		        		})
		        	}}/>,
		        	onSelect: (modelElement, viewElement)=>{
		        		var responsive = modelElement.getAttribute('responsive');
				    	var ratio = modelElement.getAttribute('ratio');
				    	var order = modelElement.getAttribute('order');
				    	modelElement['toolBarExpand'].setValue({responsive, ratio, order});
					},
					editable: true,
		        });
		        
		        return col;
		    }
        } );
		
		
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:responsive:column', ( evt, data, conversionApi ) => {
			this._applyResponsive(evt, data, conversionApi);
		} )
		);
		 
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:ratio:column', ( evt, data, conversionApi ) => {
			this._applyResponsive(evt, data, conversionApi);
		} )
		);
		
		editor.conversion.for( 'downcast' ).add( dispatcher =>
		dispatcher.on( 'attribute:order:column', ( evt, data, conversionApi ) => {
			this._applyResponsive(evt, data, conversionApi);
		} )
		);
		//============================================================================
		
		
		// Dedicated converter to propagate table's attribute to the img tag.
		editor.conversion.for( 'dataDowncast' ).elementToElement( {
		    model: 'box',
		    view: ( modelElement, viewWriter ) => {
		        return viewWriter.createContainerElement( 'div', {class: 'box'} )
		    }
		} );
		
		editor.conversion.for( 'upcast' ).elementToElement( {
		    view: {
		        name: 'div',
		        classes: 'box'
		    },
		    model: ( viewElement, modelWriter ) => {
		    	
		        return modelWriter.createElement( 'box');
		    }
		} );
		
		editor.conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'box',
            view: ( modelElement, viewWriter ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createContainerElement( 'div', {class: 'box'} );
                var widgetFactory = new MagicWidgetFactory(this.editor);
                var box = widgetFactory.make(viewWriter, modelElement, div, {resize: true, color:'#8bc34a', editable:true});
                
                return box;
            }
        } );

		
	}
	
	_applyResponsive(evt, data, conversionApi){
		var modelElement = data.item;
		var viewElement = conversionApi.mapper.toViewElement( modelElement );
		
		var responsive = modelElement.getAttribute('responsive');
    	var ratio = modelElement.getAttribute('ratio');
    	var order = modelElement.getAttribute('order');
    	var className = 'col';
    	if(isset(responsive) && responsive !='' && isset(ratio) && ratio !='') className = className +'-'+responsive;
    	if(isset(ratio) && ratio !='') className = className +'-'+ratio;
    	
    	var regex = /^col$|^col\-[\d]{1,2}$|^col\-[\w]{2}\-[\d]{1,2}$|order/;
    	var classes = viewElement.getClassNames();
    	for (let oldClassName of classes){
    		if(regex.test(oldClassName)){
    			conversionApi.writer.removeClass(oldClassName, viewElement);
    		}
    	}
    	
    	if(isset(order) && order !='') conversionApi.writer.addClass(order, viewElement);
    	conversionApi.writer.addClass(className, viewElement);
    	
	}

	
	
}



