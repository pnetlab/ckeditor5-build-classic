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
import makePosition from './positionFactory'

import ReactView from '../ui/reactview';
import React from 'react'
import PositionComp from './ui/PositionComp';
import {getSelectElement} from '../helper/selection';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Position extends Plugin {
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
		return 'Position';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this._registerSchema();
		this._registerConverters();
		
		
		
		editor.ui.componentFactory.add( 'positionButton', locale => {
			
			const dropdownView = createDropdown( locale );
            
            // Decorate dropdown's button.
            dropdownView.buttonView.set( {
                label: t( 'Position' ),
                tooltip: true,
                withText: true,
                class: 'ck-button__label__fit', 
                 
            } );
			
            
            var ui = new ReactView(locale, <PositionComp ref={ui=>this.positionUI = ui} 
            	onChange={(values)=>{this._positionCtrl(values)}}>
            	</PositionComp>);
            
            dropdownView.buttonView.on('execute', ()=>{
            	this.positionUI.setValue(this._getPosition());
            })
			
            dropdownView.panelView.children.add(ui);
            
            return dropdownView;
            
        } );
		
		var schema = this.editor.model.schema;
		
		if(schema.isRegistered( 'column' )) makePosition(editor, 'column');
		if(schema.isRegistered( 'box' )) makePosition(editor, 'box');
		if(schema.isRegistered( 'row' )) makePosition(editor, 'row');

		if(schema.isRegistered( 'paragraph' )) makePosition(editor, 'paragraph');
		if(schema.isRegistered( 'listItem' )) makePosition(editor, 'listItem');
		if(schema.isRegistered( 'heading3' )) makePosition(editor, 'heading3');
		if(schema.isRegistered( 'heading2' )) makePosition(editor, 'heading2');
		if(schema.isRegistered( 'heading1' )) makePosition(editor, 'heading1');

		if(schema.isRegistered( 'image' )) makePosition(editor, 'image');
		if(schema.isRegistered( 'html' )) makePosition(editor, 'html');

		if(schema.isRegistered( 'square' )) makePosition(editor, 'square');
		if(schema.isRegistered( 'oval' )) makePosition(editor, 'oval');

		if(schema.isRegistered( 'table' )) makePosition(editor, 'table');
		
	}
	
	_positionCtrl(values){
		var positionable = this._getPositionable();
		positionable.map(item=>{
			this._setposition(item, values);
		})
	}
	
	_getPositionable(){
		var selection = this.editor.model.document.selection;
		var validElement = [];
		if(selection.isCollapsed){
			var parent = findParent(selection.getFirstPosition(), (element) => { return this.editor.model.schema.checkAttribute(element, 'positionable') });
			if(parent) validElement.push(parent);
			return validElement;
		}

		var selectionElement = selection.getSelectedElement();
		if (selectionElement) {
			if (this.editor.model.schema.checkAttribute(selectionElement, 'positionable')) {
				validElement.push(selectionElement);
				return validElement;
			}
		}

		validElement = getSelectElement(selection, item => this.editor.model.schema.checkAttribute(item, 'positionable'));
		return validElement;
			
	}
	
	_setposition(positionableElement, values){
		this.editor.model.change(writer=>{
			writer.setAttributes(values, positionableElement);
		})
	}
	
	_getPosition(){
		var positionableElement = this._getPositionable();
		
		if(positionableElement[0]){
			positionableElement = positionableElement[0];
			var values = {};
			values.classname = get(positionableElement.getAttribute('classname'), '');
			values.id = get(positionableElement.getAttribute('id'), '');
			values.display = get(positionableElement.getAttribute('display'), '');
			values.position = get(positionableElement.getAttribute('position'), '');
			values.overflow = get(positionableElement.getAttribute('overflow'), '');
			values.cursor = get(positionableElement.getAttribute('cursor'), '');
			values.float = get(positionableElement.getAttribute('float'), '');
			values.flexWrap = get(positionableElement.getAttribute('flexWrap'), '');
			values.flexDirection = get(positionableElement.getAttribute('flexDirection'), '');
			values.flexGrow = get(positionableElement.getAttribute('flexGrow'), '');
			values.alignSelf = get(positionableElement.getAttribute('alignSelf'), '');
			values.alignItems = get(positionableElement.getAttribute('alignItems'), '');
			values.justifyContent = get(positionableElement.getAttribute('justifyContent'), '');
			values.top = get(positionableElement.getAttribute('top'), '');
			values.right = get(positionableElement.getAttribute('right'), '');
			values.left = get(positionableElement.getAttribute('left'), '');
			values.bottom = get(positionableElement.getAttribute('bottom'), '');
			values.alignment = get(positionableElement.getAttribute('alignment'), '');
			return values;
		}else{
			return {};
		}
		
	}
	
	_registerSchema() {
		
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */ 
	_registerConverters() {

		this.editor.data.upcastDispatcher.on( 'element', ( evt, data, conversionApi ) => {
			
			if(data.viewItem.hasAttribute('positionable')){
				
				const { consumable, schema, writer } = conversionApi;
				var viewElement = data.viewItem;
				
				var values = {};
				values.classname = get(viewElement.getAttribute('classname'), '');
				values.id = get(viewElement.getAttribute('id'), '');
				values.display = get(viewElement.getAttribute('display'), '');
				values.position = get(viewElement.getStyle('position'), '');
				values.overflow = get(viewElement.getStyle('overflow'), '');
				values.cursor = get(viewElement.getStyle('cursor'), '');
				values.float = get(viewElement.getStyle('float'), '');
				values.flexWrap = get(viewElement.getStyle('flex-wrap'), '');
				values.flexDirection = get(viewElement.getStyle('flex-direction'), '');
				values.flexGrow = get(viewElement.getStyle('flex-grow'), '');
				values.alignSelf = get(viewElement.getStyle('align-self'), '');
				values.alignItems = get(viewElement.getStyle('align-items'), '');
				values.justifyContent = get(viewElement.getStyle('justify-content'), '');
				values.top = get(viewElement.getStyle('top'), '');
				values.right = get(viewElement.getStyle('right'), '');
				values.left = get(viewElement.getStyle('left'), '');
				values.bottom = get(viewElement.getStyle('bottom'), '');
				values.alignment = get(viewElement.getStyle('alignment'), '');
		    	for ( const item of data.modelRange.getItems( { shallow: true } ) ) {
		            if ( schema.checkAttribute( item, 'positionable' )) {
		                writer.setAttributes( values, item );
		            }
		        }
			}
		} , { priority: 'low' } );
	
		
	}

	
	
}



