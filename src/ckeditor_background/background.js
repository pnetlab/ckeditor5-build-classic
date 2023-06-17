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
import makebackground from './backgroundFactory'

import ReactView from '../ui/reactview';
import React from 'react'
import BackgroundComp from './ui/BackgroundComp';
import {getSelectElement} from '../helper/selection';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class background extends Plugin {
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
		return 'Background';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;

		this._registerSchema();
		this._registerConverters();


		editor.ui.componentFactory.add('backgroundButton', locale => {

			const dropdownView = createDropdown(locale);

			// Decorate dropdown's button.
			dropdownView.buttonView.set({
				label: t('Background'),
				tooltip: true,
				withText: true,
				class: 'ck-button__label__fit',

			});


			var ui = new ReactView(locale, <BackgroundComp ref={ui => this.backGroundUI = ui}
				onChange={(values) => { this._backgroundCtrl(values) }} editor={this.editor}>
			</BackgroundComp>);

			dropdownView.buttonView.on('execute', () => {
				this.backGroundUI.setValue(this._getBackground());
			})

			dropdownView.panelView.children.add(ui);

			return dropdownView;

		});

		var schema = this.editor.model.schema;
		
		if(schema.isRegistered( 'row' )) makebackground(editor, 'row');
		if(schema.isRegistered( 'column' )) makebackground(editor, 'column');
		if(schema.isRegistered( 'box' )) makebackground(editor, 'box');
		if(schema.isRegistered( 'image' )) makebackground(editor, 'image');
		
		
		if(schema.isRegistered( 'square' )) makebackground(editor, 'square');
		if(schema.isRegistered( 'oval' )) makebackground(editor, 'oval');

		if(schema.isRegistered( 'paragraph' )) makebackground(editor, 'paragraph');
		if(schema.isRegistered( 'listItem' )) makebackground(editor, 'listItem');
		if(schema.isRegistered( 'heading3' )) makebackground(editor, 'heading3');
		if(schema.isRegistered( 'heading2' )) makebackground(editor, 'heading2');
		if(schema.isRegistered( 'heading1' )) makebackground(editor, 'heading1');

		if(schema.isRegistered( 'html' )) makebackground(editor, 'html');
		


	}

	_backgroundCtrl(values) {

		this.editor.model.change(writer => {
			var backgroundable = this._getBackgroundable();
			backgroundable.map(item => {
				this._setbackground(item, values, writer);
			})
		})

	}

	_getBackgroundable() {
		var selection = this.editor.model.document.selection;
		var validElement = [];
		if(selection.isCollapsed){
			var parent = findParent(selection.getFirstPosition(), (element) => { return this.editor.model.schema.checkAttribute(element, 'backgroundable') });
			if(parent) validElement.push(parent);
			return validElement;
		}

		var selectionElement = selection.getSelectedElement();
		if (selectionElement) {
			if (this.editor.model.schema.checkAttribute(selectionElement, 'backgroundable')) {
				validElement.push(selectionElement);
				return validElement;
			}
		}

		validElement = getSelectElement(selection, item => this.editor.model.schema.checkAttribute(item, 'backgroundable'));
		return validElement;

	}

	_setbackground(backgroundableElement, values, writer) {
		
		writer.setAttributes(values, backgroundableElement);
	}

	_getBackground() {
		var backgroundableElement = this._getBackgroundable();

		if (backgroundableElement[0]) {
			backgroundableElement = backgroundableElement[0];
			return {
				backgroundImage: backgroundableElement.getAttribute('backgroundImage'),
				backgroundColor: backgroundableElement.getAttribute('backgroundColor'),
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
						'background-color': /.+/
					}
				},
				model: {
					key: 'backgroundColor',
					value: viewElement => viewElement.getStyle('background-color')
				}
			});

		editor.conversion.for('upcast')
			.attributeToAttribute({
				view: {
					styles: {
						'background-image': /.+/
					}
				},
				model: {
					key: 'backgroundImage',
					value: viewElement => {
						var url = viewElement.getStyle('background-image');
						var m;
						if ((m = /url\(["'](.+)["']\)/.exec(url)) !== null) {
							return m[1];
						} else return '';
					}
				}
			});

	}



}



