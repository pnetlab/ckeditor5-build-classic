/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import SetLineCommand from '@ckeditor/ckeditor5-table/src/commands/setlinecommand';

import {InsertBoxCommand, InsertRowCommand, InsertColCommand} from './commands/insertgridcommand';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import magicWidgetRegister from '../ckeditor_magicwidget/widgetRegister';
import MagicWidgetFactory from '../ckeditor_magicwidget/widgetFactory';
import React, { Component } from 'react'
import { render } from 'react-dom'
import Box from './ui/Box'
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ReactPlugin extends Plugin {
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
		return 'ReactPlugin';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this._registerSchema();
		this._registerConverters();
		
		
		
		editor.ui.componentFactory.add( 'reactButton', locale => {
			
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
                label: t( 'Insert box' ),
                withText: true,
                tooltip: true
            } );
            
            this.listenTo( rowButtonView, 'execute', () => {
            	this.editor.model.change( writer => {
        			// Insert <simpleBox>*</simpleBox> at the current selection position
        			// in a way that will result in creating a valid model structure.
        			const selection = this.editor.model.document.selection;
        			var container = findParent(selection.getFirstPosition(), (item)=>this.editor.model.schema.checkChild(item, 'react'));
        			if(!container) return;
        			var boxElement = writer.createElement( 'react');
        			writer.append(boxElement, container)
        			
        		} );
            } );
            
            dropdownView.panelView.children.add(rowButtonView)
            
            
            return dropdownView;
            
        } );
		
		
		
	}
	
	_registerSchema() {
		
		this.editor.model.schema.register( 'react', {
			allowWhere: '$block',
			allowAttributes: [],
			allowContentOf: '$root',
			isObject: true,
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
		    model: 'react',
		    view: ( modelElement, viewWriter ) => {
		        return viewWriter.createContainerElement( 'div', {class: 'react'} )
		    }
		} );
		
		editor.conversion.for( 'upcast' ).elementToElement( {
		    view: {
		        name: 'react',
		        classes: 'react'
		    },
		    model: ( viewElement, modelWriter ) => {
		    	
		        return modelWriter.createElement( 'react' );
		    }
		} );
		
		editor.conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'react',
            view: ( modelElement, viewWriter ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createContainerElement( 'div', {class: 'react'} );
                var dom = this.editor.editing.view.domConverter.viewToDom(div, document);
                this.editor.editing.view.domConverter.bindElements(dom, div)
                
                var boxView = viewWriter.createContainerElement( 'div',{style:"width:50px;height:50px"});
		 	   	//this.boxDom = this.editor.editing.view.domConverter.viewToDom(boxView, document);
		    	var boxDom = <div>test</div>;
		        this.editor.editing.view.domConverter.bindElements(boxDom, boxView)
		        
		        viewWriter.insert(viewWriter.createPositionAt(div, 0), boxView);
                
                render(<div>{boxDom}
                </div>, dom);
                
                return div;
            }
        } );

	}

	
	
}



