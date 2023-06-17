/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import magicWidgetRegister from '../ckeditor_magicwidget/widgetRegister';
import MagicWidgetFactory from '../ckeditor_magicwidget/widgetFactory';
import React, { Component } from 'react'
import ReactView from '../ui/reactview';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class shape_oval extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'shape_oval';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;

		this._registerSchema();
		this._registerConverters();

		magicWidgetRegister(this.editor, 'oval');


		editor.ui.componentFactory.add('ovalButton', locale => {

			var ui = new ReactView(locale, <div className='button' style={{ 
				width: 15, height: 15, 
				borderRadius: 2, 
				border: 'solid thin', 
				cursor: 'pointer', 
				borderRadius:'50%', 
				background: '#bbf7ff', 
				margin: '0px 5px' 
			}} onClick={() => { this.insertBox() }}></div>);
			return ui;

		});



	}

	insertBox() {
		this.editor.model.change(writer => {
			// Insert <simpleBox>*</simpleBox> at the current selection position
			// in a way that will result in creating a valid model structure.
			const selection = this.editor.model.document.selection;

			var mousePosition = selection.getSelectedElement();
			if(!mousePosition) mousePosition = selection.getFirstPosition().parent;
			
			var ovalIteam = writer.createElement('oval');

			var container = findParent(selection.getFirstPosition(), (item) => this.editor.model.schema.checkChild(item, 'oval'));
			if (container) {
				
				if(mousePosition.parent.name == container.name){
					writer.insert(ovalIteam, writer.createPositionBefore(mousePosition));
					if(mousePosition.name == 'paragraph' && mousePosition.childCount == 0){
						writer.remove(mousePosition);
					}
				}else{
					writer.append(ovalIteam, container);
				}
			}

			

		});
	}

	_registerSchema() {

		this.editor.model.schema.register('oval', {
			allowWhere: '$block',
			allowContentOf: '$block',
			allowAttributes: [],
			defaults: {
				width: '100',
				wunit: '%',
				height: '95',
				hunit: '%',
				borderLeft: 'solid',
				borderRight: 'solid',
				borderTop: 'solid',
				borderBottom: 'solid',
				borderWeight: '1px',
				borderRadius: '50%',
			},
			isLimit: true,
			isObject: true,
			isBlock: true,
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
		editor.conversion.for('dataDowncast').elementToElement({
			model: 'oval',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('div', { class: 'oval' })
			}
		});

		editor.conversion.for('upcast').elementToElement({
			view: {
				name: 'div',
				classes: 'oval'
			},
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('oval');
			}
		});

		editor.conversion.for('editingDowncast').elementToElement({
			model: 'oval',
			view: (modelElement, viewWriter) => {
				// Note: You use a more specialized createEditableElement() method here.
				const div = viewWriter.createEditableElement('div', { class: 'oval', style:"cursor:pointer" }, null, {
					click: (ve, de, ev) => {
						var shapeModel = this.editor.editing.mapper.toModelElement(ve);
						this.editor['magicwidget_selected'] = {1: shapeModel};
						shapeModel['magicwidget_factory']._showSelectWidget();
						this.editor.model.change(writer => {
							var start = writer.createPositionBefore(shapeModel);
							var end = writer.createPositionAfter(shapeModel);
							var range = writer.createRange(start, end);
							writer.setSelection(range);
						})
					}
				});
				var widgetFactory = new MagicWidgetFactory(this.editor);
				var oval = widgetFactory.make(viewWriter, modelElement, div, { resize: 'both', color: '#2196F3', editable: true });
				return oval;
			}
		});




	}



}



