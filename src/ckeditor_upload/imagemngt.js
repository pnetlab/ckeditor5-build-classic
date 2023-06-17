/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
 
/**
 * @module image/imageupload/ImageMngt
 */
 
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import browserIcon from './ui/icons/folder-open-regular.svg';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import ListView from '@ckeditor/ckeditor5-ui/src/list/listview';

import FuncUploadModal from '../ui/components/ImgMngtComp'
import React, { Component } from 'react'
import { render } from 'react-dom'

/**
 * The image upload button plugin.
 *
 * For a detailed overview, check the {@glink features/image-upload/image-upload Image upload feature} documentation.
 *
 * Adds the `'imageUpload'` button to the {@link module:ui/componentfactory~ComponentFactory UI component factory}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageMngt extends Plugin { 
    /** 
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const t = this.editor.t;
        
        
         
        editor.ui.componentFactory.add( 'imagemngt', locale => {
             
            const dropdownView = createDropdown( locale );
             
            // Decorate dropdown's button.
            dropdownView.buttonView.set( {
                label: t( 'Insert image' ),
                icon: imageIcon,
                tooltip: true,
                
                 
            } );
             
            const browserBtn = new ButtonView( locale );
 
            browserBtn.set( {
                label: 'Browser',
                icon: browserIcon,
                tooltip: true,
                withText: true
            } );
            
            var mngtCfg = editor.config.get('image.imgmngt');
            
            
            var onClick = get(mngtCfg['onClick'], ()=>{});
            var browser = get(mngtCfg['browser'], false);
            
            
             
            const itemDefinitions = new ListView(locale);
            itemDefinitions.items.add(editor.ui.componentFactory.create('imageUpload'));
            //itemDefinitions.items.add(browserBtn);
            if(browser) itemDefinitions.items.add(browserBtn);
             
            dropdownView.panelView.children.add(itemDefinitions);
            // var container = document.createElement("div");
            // document.getElementsByTagName('body')[0].appendChild(container);
            // var imageModal = render (<FuncUploadModal table={table} column={column} link={link} 
            // 	onClick={(path)=>{ return onClick(path)}}
            // 	onSelect={(src)=>{editor.commands.get( 'imageInsert' ).execute({source:src});}}
            // />, container); 
            
            browserBtn.on('execute', ()=>{onClick((src)=>{
                if(mngtCfg['decorator']) src = mngtCfg['decorator'](src);
                editor.commands.get( 'imageInsert' ).execute({source:src});
            })});   
             
            return dropdownView;
        } );
    }
}