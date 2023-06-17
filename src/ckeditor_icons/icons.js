/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import ReactView from '../ui/reactview';
import React, { Component } from 'react';
import IconsComp from './ui/IconsComp'
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class icons extends Plugin {
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
		return 'icons';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this._registerSchema();
		this._registerConverters();
		
		editor.ui.componentFactory.add( 'iconsButton', locale => {
			
			const dropdownView = createDropdown( locale );
            
            // Decorate dropdown's button.
            dropdownView.buttonView.set( {
                label: t( 'Icons' ),
                tooltip: true,
                withText: true,
                class: 'ck-button__label__fit', 
                 
            } );
            
            var ui = new ReactView(locale, <IconsComp onClick={(icon)=>{
                this.editor.model.change(writer => {
					var position = this.editor.model.document.selection.getFirstPosition();
					if(!editor.model.schema.checkChild(position.parent, 'icon')) return;
                    var iconElement = writer.createElement('icon', {className : icon});
                    writer.insert(iconElement, position);
				})
            }}></IconsComp>);

			dropdownView.panelView.children.add(ui);

			return dropdownView;
             
        } );


        this.editor.editing.view.document.on('keydown', (event, dom)=>{
			var evt = dom.domEvent;
			if(evt.code == 'ArrowRight'){
				var selectElement = editor.model.document.selection.getSelectedElement();
                if(!selectElement) return;
                if(selectElement.name != 'icon') return;

				this.editor.model.change(writer => {
					var start = writer.createPositionAfter(selectElement);
					writer.insertText( '', start );
				});
			}
		}, {priority:100000});
		
		
		
	}
	
	_registerSchema() {
        
		this.editor.model.schema.register( 'icon', {
            allowIn: ['$block', '$clipboardHolder'],
            isInline: true,
            allowAttributes: ['className', 'fontColor', 'fontSize', 'fontBackgroundColor'],
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
		editor.conversion.for( 'editingDowncast' ).elementToElement( {
		    model: 'icon',
		    view: ( modelElement, viewWriter ) => {
				var span = viewWriter.createContainerElement('span', {}, [], {
                    click: (ve, de, ev) => {
                        var model = this.editor.editing.mapper.toModelElement(ve);
                        this.editor.model.change(writer => {
                            var range = writer.createRangeOn(model);
                            writer.setSelection(range);
                        })
                    }
                    
                });

				var icon = viewWriter.createContainerElement('i', { class: `icon ${modelElement.getAttribute('className')}` })
				viewWriter.insert(viewWriter.createPositionAt( span, 0), icon);
				return span;
		    }
		} ).add( dispatcher =>
			dispatcher.on( 'attribute:fontColor:icon', ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
				
				if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
					viewWriter.setStyle( 'color', data.attributeNewValue, viewElement );
				} else {
					viewWriter.removeStyle( 'color', viewElement );
				}
			} )
		).add( dispatcher =>
			dispatcher.on( 'attribute:fontSize:icon', ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
				
				if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
					viewWriter.setStyle( 'font-size', data.attributeNewValue, viewElement );
				} else {
					viewWriter.removeStyle( 'font-size', viewElement );
				}
			})
		).add( dispatcher =>
			dispatcher.on( 'attribute:fontBackgroundColor:icon', ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
				
				if ( data.attributeNewValue !== null && data.attributeNewValue!=='') {
					viewWriter.setStyle( 'background-color', data.attributeNewValue, viewElement );
				} else {
					viewWriter.removeStyle( 'background-color', viewElement );
				}
			})
		);
        
		editor.conversion.for( 'dataDowncast' ).elementToElement( {
		    model: 'icon',
		    view: ( modelElement, viewWriter ) => {
                return viewWriter.createEmptyElement('i', { class: `icon ${modelElement.getAttribute('className')}` })
		    }
		} );
		
		editor.conversion.for( 'upcast' ).elementToElement( {
		    view: {
		        name: 'i',
		        classes: 'icon'
		    },
		    model: ( viewElement, modelWriter ) => {
                var className = viewElement.getAttribute('class');
                className = className.replace('icon ', '');
				var model = modelWriter.createElement( 'icon',{className});
				return model;
		    }
		} );
		
    }
	
}



