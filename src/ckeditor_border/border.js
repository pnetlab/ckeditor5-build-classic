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
import makeBorder from './borderFactory'

import ReactView from '../ui/reactview';
import React from 'react'
import BorderComp from './ui/BorderComp';
import {getSelectElement} from '../helper/selection';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Border extends Plugin {
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
		return 'Border';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;

		this._registerSchema();
		this._registerConverters();

		editor.ui.componentFactory.add('borderButton', locale => {

			const dropdownView = createDropdown(locale);

			// Decorate dropdown's button.
			dropdownView.buttonView.set({
				label: t('Border'),
				tooltip: true,
				withText: true,
				class: 'ck-button__label__fit',

			});


			var ui = new ReactView(locale, <BorderComp ref={ui => this.borderUI = ui}
				onChange={(values) => { this._borderCtrl(values) }}>
			</BorderComp>);

			dropdownView.buttonView.on('execute', () => {
				this.borderUI.setValue(this._getBorder());
			})

			dropdownView.panelView.children.add(ui);

			return dropdownView;

		});

		var schema = this.editor.model.schema;
		
		if(schema.isRegistered( 'paragraph' )) makeBorder(editor, 'paragraph');
		if(schema.isRegistered( 'listItem' )) makeBorder(editor, 'listItem');
		if(schema.isRegistered( 'heading3' )) makeBorder(editor, 'heading3');
		if(schema.isRegistered( 'heading2' )) makeBorder(editor, 'heading2');
		if(schema.isRegistered( 'heading1' )) makeBorder(editor, 'heading1');
		
		if(schema.isRegistered( 'square' )) makeBorder(editor, 'square');
		if(schema.isRegistered( 'oval' )) makeBorder(editor, 'oval');
		if(schema.isRegistered( 'row' )) makeBorder(editor, 'row');
		if(schema.isRegistered( 'column' )) makeBorder(editor, 'column');
		if(schema.isRegistered( 'box' )) makeBorder(editor, 'box');
		if(schema.isRegistered( 'image' )) makeBorder(editor, 'image');

		if(schema.isRegistered( 'html' )) makeBorder(editor, 'html');
		//		


	}

	_borderCtrl(values) {
		this.editor.model.change(writer => {
			var borderable = this._getBorderable();
			borderable.map(item => {
				this._setBorder(item, values, writer);
			})
		})
	}

	_getBorderable() {
		var selection = this.editor.model.document.selection;
		var validElement = [];
		if(selection.isCollapsed){
			var parent = findParent(selection.getFirstPosition(), (element) => { return this.editor.model.schema.checkAttribute(element, 'borderable') });
			if(parent) validElement.push(parent);
			return validElement;
		}

		var selectionElement = selection.getSelectedElement();
		if (selectionElement) {
			if (this.editor.model.schema.checkAttribute(selectionElement, 'borderable')) {
				validElement.push(selectionElement);
				return validElement;
			}
		}

		validElement = getSelectElement(selection, item => this.editor.model.schema.checkAttribute(item, 'borderable'));
		return validElement;

	}

	_setBorder(borderableElement, values, writer) {
		writer.setAttributes(values, borderableElement);
	}

	_getBorder() {
		var borderableElement = this._getBorderable();

		if (borderableElement[0]) {
			borderableElement = borderableElement[0];
			return {
				borderLeft: borderableElement.getAttribute('borderLeft'),
				borderRight: borderableElement.getAttribute('borderRight'),
				borderTop: borderableElement.getAttribute('borderTop'),
				borderBottom: borderableElement.getAttribute('borderBottom'),
				borderWeight: borderableElement.getAttribute('borderWeight'),
				borderColor: borderableElement.getAttribute('borderColor'),
				borderRadius: borderableElement.getAttribute('borderRadius'),
			}
		} else {
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
		const editor = this.editor;

		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'border-left-style': /.+/
					}
				},
				model: {
					key: 'borderLeft',
					value: viewElement => viewElement.getStyle('border-left-style')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'border-right-style': /.+/
					}
				},
				model: {
					key: 'borderRight',
					value: viewElement => viewElement.getStyle('border-right-style')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'border-top-style': /.+/
					}
				},
				model: {
					key: 'borderTop',
					value: viewElement => viewElement.getStyle('border-top-style')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'border-bottom-style': /.+/
					}
				},
				model: {
					key: 'borderBottom',
					value: viewElement => viewElement.getStyle('border-bottom-style')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'border-width': /.+/
					}
				},
				model: {
					key: 'borderWeight',
					value: viewElement => viewElement.getStyle('border-width')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'border-color': /.+/
					}
				},
				model: {
					key: 'borderColor',
					value: viewElement => viewElement.getStyle('border-color')
				}
			});
		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'border-radius': /.+/
					}
				},
				model: {
					key: 'borderRadius',
					value: viewElement => viewElement.getStyle('border-radius')
				}
			});

	}



}



