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
import makePadding from '../ckeditor_padding/paddingFactory';

import ReactView from '../ui/reactview';
import React from 'react'
import PaddingComp from '../ckeditor_padding/ui/PaddingComp';
import paddingIcon from './ui/icons/padding.svg';
import SetPaddingCommand from './commands/setpaddingcommand';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Padding extends Plugin {
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
		return 'TablePadding';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;

		editor.ui.componentFactory.add('paddingTableButton', locale => {
			const command = editor.commands.get( 'SetLineCommand' );
			const dropdownView = createDropdown(locale);

			// Decorate dropdown's button.
			dropdownView.buttonView.set({
				label: t('Padding'),
				tooltip: true,
				withText: false,
				class: 'ck-button__label__fit',
				icon: paddingIcon,
			});


			var ui = new ReactView(locale, <PaddingComp ref={ui => this.paddingUI = ui}
				onChange={(left, right, top, bottom) => { this._paddingCtrl(left, right, top, bottom) }}>
			</PaddingComp>);

			dropdownView.buttonView.on('execute', () => {
				this.paddingUI.setValue(this._getPadding());
			})


			dropdownView.panelView.children.add(ui);
			dropdownView.bind('isEnabled').to(command);

			return dropdownView;

		});



		makePadding(editor, 'tableCell');


	}

	_paddingCtrl(left, right, top, bottom) {
		if (this.editor.selectCells && Object.keys(this.editor.selectCells).length > 0) {
			this.editor.model.change(writer => {
				var selected = this.editor.selectCells;
				for (let i in selected) {
					this._setPadding(selected[i], left, right, top, bottom, writer);
				}

			})
		}

	}

	_setPadding(paddingableElement, left, right, top, bottom, writer) {

		var values = {};
		if (isset(left)) values.paddingLeft = left;
		if (isset(right)) values.paddingRight = right;
		if (isset(top)) values.paddingTop = top;
		if (isset(bottom)) values.paddingBottom = bottom;
		writer.setAttributes(values, paddingableElement);

	}

	_getPadding() {
		if (this.editor.selectCells && Object.keys(this.editor.selectCells).length > 0) {
			var paddingableElement = this.editor.selectCells[Object.keys(this.editor.selectCells)[0]];
			return {
				left: paddingableElement.getAttribute('paddingLeft'),
				right: paddingableElement.getAttribute('paddingRight'),
				top: paddingableElement.getAttribute('paddingTop'),
				bottom: paddingableElement.getAttribute('paddingBottom'),
			}
		} else {
			return {};
		}

	}

	


}



