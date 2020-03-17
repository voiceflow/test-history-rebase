import { action } from '@storybook/addon-actions';
import React from 'react';

import { composeDecorators, withDnD, withModalContext, withRedux } from '@/../.storybook';
import { ConfirmModal, ErrorModal } from '@/components/LegacyModal';
import { ModalType, UserRole } from '@/constants';
import { EventualEngineProvider, RegisterEngine } from '@/contexts/EventualEngineContext';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { RolePermissionsProvider } from '@/contexts/RolePermissionsContext';
import { EditPermissionProvider, ShortcutModalProvider } from '@/pages/Canvas/contexts';

import LeftSidebar from '.';

export default {
  title: 'Creator/Left Sidebar',
  component: LeftSidebar,
};

const createStory = ({ tab, userId = '1', platform = null, diagramID = '9bee442a409df7a789a9075c95350658' } = {}) =>
  composeDecorators(
    withDnD,
    withModalContext(ModalType.INTERACTION_MODEL),
    withRedux({
      ui: {
        creatorMenu: {
          isHidden: false,
          activeMenu: tab,
        },
        blockMenu: {
          openSections: ['basic'],
        },
      },
      account: { creator_id: userId },
      skill: {
        platform,
        diagramID,
      },
      realtime: {
        locks: {
          users: {
            [diagramID]: { 1: userId },
            fe425fd43cfd2f5590890070005be98b: { 1: '2', 2: '3' },
          },
          resources: {},
        },
      },
      diagram: {
        allKeys: [
          '9bee442a409df7a789a9075c95350658',
          'ffea5dbd187b660ea20b1ffeb327c05b',
          '76b3d28743d8c0df95bd4389f8f12676',
          '816006a2dc8e0b1f914fad78faac1094',
          '76e256a7be3748d09afe97fe44afbf6c',
          'fe425fd43cfd2f5590890070005be98b',
          '7b17e9154ba5c03d85443f986ff05159',
          '170a2413e264f5488e0855dcf4f1d57e',
          'cac5cc582e789393884a9b4f972d8b5a',
          '7d72cf88869ed02b9e4f1e884b7ac5c7',
          '55b507c871230d6990b60540270a56a9',
          '909a61021baf5ddd84f9434a1d1cb351',
          '612873c24affb56f9f943733f87d0d1d',
          'ffec08e32a414bfe8b90e6b956d7f07e',
          '563be757677b6c32bdc5c4d0545ad9c3',
          '754f1e5a84b41a57ba7b6b497aa96d74',
          '2e6102a72bfa62af8a2ae97504c5ff71',
          '09039444b9ac4a10a88726310a24672b',
          '3656f8ffa15d3dc5b7fa4d96324b3848',
          'c06c6b687631c605ae04a8ecb069f9bc',
          'd19e2ba8ffa1bf4dbb0b310c38e07443',
          '36289ab3514534fabc100e1a781ccda4',
          '4f4900e907af97ffaf12e6ff5f4297ba',
          '855f60abc098ef96a84174353bf795aa',
          '602e00582b5afd3d9619512c74eb5ee6',
          'd170b4fdd072c936a8ffc60b88db47f8',
          '6e03ce776535eb7e8cd38681ea9c1319',
          'd30fbe5db27d8bfbac994091ee7fee5e',
          '1d3249337ec8437fbfebd57f4b3bfcbd',
          '69d1b88b28b11cb19e5cfd1303896d92',
          'fb4a3864eba73b20a804c1ed032d37f2',
          '9845c0a3bbe9d012aca82f34b5d46e89',
          'e8d77b55cffaa48f94e493b8144f0bbe',
          'e675a97b7dab6f12bfd014c409b7a647',
          '9c12ba7068afdaa7b41630650d0d43e7',
          'a392b4a84519cf02ada8ab1b0f49ea72',
          'dd56e611adaf83efa9a52a403bd2f088',
          '42bc8174d836f4279126f0cfc6a5faec',
          '40c8a220eb55b9db97efe51a8d9d6794',
          'ea0e36642cb1ad5b8423139cf62f8551',
          '224a5dc1830d6cc39dd7492939a1cf74',
          '1c98040f2280f8338196a6220f4e2792',
          '64c1cad93945bfa3a8870d967df4d21b',
          'b653f5fb6ac12819aec3565eb2d4fb32',
          'f9beda586a0f0e9896afd9e69b8fd9f4',
          '816ff75cd4cf6d418fd54e588d8fe949',
          '622aec1c2a49b147b5e5a91064252f0b',
          '23229e95f5d3b95cae0d8815b96d9289',
          '0fa2e8d20874e8abab79004e2cf281b5',
          '5b7f685e02fce5afbd86482f58ab74a7',
          'a639932d736c04b4bff28b4a20b6f751',
          '2691dd0790d70f21970bf1e354fb7ccf',
          '70e338927a3a10f494fe98a1a2fce110',
          '573f595884112a0ebe0cf6399743581c',
          '712f3c2dd392baeaaf75b538dd46b8fe',
          '8d73d9d48644c322b474ad765749b44f',
          'f636101a4ee563298366a4bc996d847f',
          '609a64ed3b274695baf8dd0aae99a095',
          'a418d71f572b957cb32466846cd7d3a5',
          '1a6073c82e37ee04a3f082af26879957',
          '19ae995c698f36668dd30cfbdf6bf033',
          '564e2361252a03199b0aa9d09259b7a7',
          '9458b4ec7f97908fa092efacdc1aaf36',
          '9b6175add20d7fc58b0f8e2a93c0b004',
          '5a2cde599ba323b4b0f40c6c1c07adeb',
          'a075ac5bc4d92f269aaeb0889e4fb22a',
          '653d53171015c85290e9b25d3d414e19',
          'ece5fe021582e9b0ae9614ff9fdbfc76',
          '9823e9f6c1f5193abf732fd397df3616',
          '6146a62432c6bdc4b67ce8c43b3aa182',
          '10f8c115b4a9a6e688c34671b1cb304d',
          '306d1c9248ca4cb7b4c461c1bfda7b0e',
          '6f62e81605047bc6a8ffb4af94b229ec',
          'a83b7775e40c3551aaf859137b41c0d5',
          '0c8d5f6cec2201acbcc3c03a208ee759',
          '33b8177576df70ec9078294d29b1603a',
          '41f1667cbb77bd049807827c47836a5c',
          '3d17dba1a06b688790c40961b72659dc',
          '73f726af32fa8378a0f77083cc080a9e',
          '4b8ee42710dc16f8a89ae51af16cc869',
          '41bfe51242c6abe5b3bb028db03ff601',
          '96adb798e13d6876a5ae4269a292446e',
        ],
        byKey: {
          '9bee442a409df7a789a9075c95350658': { id: '9bee442a409df7a789a9075c95350658', name: 'BEG Flow', subDiagrams: [] },
          ffea5dbd187b660ea20b1ffeb327c05b: { id: 'ffea5dbd187b660ea20b1ffeb327c05b', name: 'FRONT FLIP Flow', subDiagrams: [] },
          '76b3d28743d8c0df95bd4389f8f12676': { id: '76b3d28743d8c0df95bd4389f8f12676', name: 'FART Flow', subDiagrams: [] },
          '816006a2dc8e0b1f914fad78faac1094': { id: '816006a2dc8e0b1f914fad78faac1094', name: 'WHISTLE Flow', subDiagrams: [] },
          '76e256a7be3748d09afe97fe44afbf6c': { id: '76e256a7be3748d09afe97fe44afbf6c', name: 'SOCCER Flow', subDiagrams: [] },
          fe425fd43cfd2f5590890070005be98b: { id: 'fe425fd43cfd2f5590890070005be98b', name: 'KISS Flow', subDiagrams: [] },
          '7b17e9154ba5c03d85443f986ff05159': { id: '7b17e9154ba5c03d85443f986ff05159', name: 'BACK FLIP Flow', subDiagrams: [] },
          '170a2413e264f5488e0855dcf4f1d57e': {
            id: '170a2413e264f5488e0855dcf4f1d57e',
            name: 'BASKETBALL BASKETBALL BASKETBALL Flow',
            subDiagrams: [],
          },
          cac5cc582e789393884a9b4f972d8b5a: { id: 'cac5cc582e789393884a9b4f972d8b5a', name: 'MEDITATE Flow', subDiagrams: [] },
          '7d72cf88869ed02b9e4f1e884b7ac5c7': { id: '7d72cf88869ed02b9e4f1e884b7ac5c7', name: 'BURP Flow', subDiagrams: [] },
          '55b507c871230d6990b60540270a56a9': { id: '55b507c871230d6990b60540270a56a9', name: 'New Game', subDiagrams: [] },
          '909a61021baf5ddd84f9434a1d1cb351': { id: '909a61021baf5ddd84f9434a1d1cb351', name: 'BOXING Flow', subDiagrams: [] },
          '612873c24affb56f9f943733f87d0d1d': { id: '612873c24affb56f9f943733f87d0d1d', name: 'BASEBALL Flow', subDiagrams: [] },
          ffec08e32a414bfe8b90e6b956d7f07e: { id: 'ffec08e32a414bfe8b90e6b956d7f07e', name: 'GUITAR Flow', subDiagrams: [] },
          '563be757677b6c32bdc5c4d0545ad9c3': { id: '563be757677b6c32bdc5c4d0545ad9c3', name: 'CAT ENEMY GENERATOR', subDiagrams: [] },
          '754f1e5a84b41a57ba7b6b497aa96d74': { id: '754f1e5a84b41a57ba7b6b497aa96d74', name: 'Level UP', subDiagrams: [] },
          '2e6102a72bfa62af8a2ae97504c5ff71': { id: '2e6102a72bfa62af8a2ae97504c5ff71', name: 'RAT ENEMY GENERATOR', subDiagrams: [] },
          '09039444b9ac4a10a88726310a24672b': { id: '09039444b9ac4a10a88726310a24672b', name: 'CAT SKILLS', subDiagrams: [] },
          '3656f8ffa15d3dc5b7fa4d96324b3848': { id: '3656f8ffa15d3dc5b7fa4d96324b3848', name: 'Winston FLOW', subDiagrams: [] },
          c06c6b687631c605ae04a8ecb069f9bc: { id: 'c06c6b687631c605ae04a8ecb069f9bc', name: 'Jessica FLOW', subDiagrams: [] },
          d19e2ba8ffa1bf4dbb0b310c38e07443: { id: 'd19e2ba8ffa1bf4dbb0b310c38e07443', name: 'SING Flow', subDiagrams: [] },
          '36289ab3514534fabc100e1a781ccda4': { id: '36289ab3514534fabc100e1a781ccda4', name: 'PURCHASE OPTIONS', subDiagrams: [] },
          '4f4900e907af97ffaf12e6ff5f4297ba': { id: '4f4900e907af97ffaf12e6ff5f4297ba', name: 'BIKING Flow', subDiagrams: [] },
          '855f60abc098ef96a84174353bf795aa': { id: '855f60abc098ef96a84174353bf795aa', name: 'FOOD', subDiagrams: [] },
          '602e00582b5afd3d9619512c74eb5ee6': { id: '602e00582b5afd3d9619512c74eb5ee6', name: 'Neighbourhood Flow', subDiagrams: [] },
          d170b4fdd072c936a8ffc60b88db47f8: { id: 'd170b4fdd072c936a8ffc60b88db47f8', name: 'Enemies Turn', subDiagrams: [] },
          '6e03ce776535eb7e8cd38681ea9c1319': { id: '6e03ce776535eb7e8cd38681ea9c1319', name: 'Display Flow Level Up', subDiagrams: [] },
          d30fbe5db27d8bfbac994091ee7fee5e: { id: 'd30fbe5db27d8bfbac994091ee7fee5e', name: 'Choose Cat', subDiagrams: [] },
          '1d3249337ec8437fbfebd57f4b3bfcbd': { id: '1d3249337ec8437fbfebd57f4b3bfcbd', name: 'DOG ENEMY GENERATOR', subDiagrams: [] },
          '69d1b88b28b11cb19e5cfd1303896d92': { id: '69d1b88b28b11cb19e5cfd1303896d92', name: 'Stats and Updates', subDiagrams: [] },
          fb4a3864eba73b20a804c1ed032d37f2: { id: 'fb4a3864eba73b20a804c1ed032d37f2', name: 'Subscription Flow', subDiagrams: [] },
          '9845c0a3bbe9d012aca82f34b5d46e89': { id: '9845c0a3bbe9d012aca82f34b5d46e89', name: 'Path', subDiagrams: [] },
          e8d77b55cffaa48f94e493b8144f0bbe: { id: 'e8d77b55cffaa48f94e493b8144f0bbe', name: 'Refund KARMA', subDiagrams: [] },
          e675a97b7dab6f12bfd014c409b7a647: { id: 'e675a97b7dab6f12bfd014c409b7a647', name: 'Help Flow', subDiagrams: [] },
          '9c12ba7068afdaa7b41630650d0d43e7': { id: '9c12ba7068afdaa7b41630650d0d43e7', name: 'Leave Jungle', subDiagrams: [] },
          a392b4a84519cf02ada8ab1b0f49ea72: { id: 'a392b4a84519cf02ada8ab1b0f49ea72', name: 'BOOMERANG Flow', subDiagrams: [] },
          dd56e611adaf83efa9a52a403bd2f088: { id: 'dd56e611adaf83efa9a52a403bd2f088', name: 'SKIPPING Flow', subDiagrams: [] },
          '42bc8174d836f4279126f0cfc6a5faec': { id: '42bc8174d836f4279126f0cfc6a5faec', name: 'SCUBA Flow', subDiagrams: [] },
          '40c8a220eb55b9db97efe51a8d9d6794': { id: '40c8a220eb55b9db97efe51a8d9d6794', name: 'KARATE Flow', subDiagrams: [] },
          ea0e36642cb1ad5b8423139cf62f8551: {
            id: 'ea0e36642cb1ad5b8423139cf62f8551',
            name: 'YAWN Flow',
            subDiagrams: ['dd56e611adaf83efa9a52a403bd2f088'],
          },
          '224a5dc1830d6cc39dd7492939a1cf74': { id: '224a5dc1830d6cc39dd7492939a1cf74', name: 'ARCHERY Flow', subDiagrams: [] },
          '1c98040f2280f8338196a6220f4e2792': { id: '1c98040f2280f8338196a6220f4e2792', name: 'MEOW Flow', subDiagrams: [] },
          '64c1cad93945bfa3a8870d967df4d21b': { id: '64c1cad93945bfa3a8870d967df4d21b', name: 'Refund HEALTH', subDiagrams: [] },
          b653f5fb6ac12819aec3565eb2d4fb32: { id: 'b653f5fb6ac12819aec3565eb2d4fb32', name: 'Welcome Flow', subDiagrams: [] },
          f9beda586a0f0e9896afd9e69b8fd9f4: { id: 'f9beda586a0f0e9896afd9e69b8fd9f4', name: 'MOTORCYCLE Flow', subDiagrams: [] },
          '816ff75cd4cf6d418fd54e588d8fe949': { id: '816ff75cd4cf6d418fd54e588d8fe949', name: 'Restaurants FLOW', subDiagrams: [] },
          '622aec1c2a49b147b5e5a91064252f0b': { id: '622aec1c2a49b147b5e5a91064252f0b', name: 'BLOW RASPBERRY Flow', subDiagrams: [] },
          '23229e95f5d3b95cae0d8815b96d9289': { id: '23229e95f5d3b95cae0d8815b96d9289', name: 'Karl FLOW', subDiagrams: [] },
          '0fa2e8d20874e8abab79004e2cf281b5': { id: '0fa2e8d20874e8abab79004e2cf281b5', name: 'HISS Flow', subDiagrams: [] },
          '5b7f685e02fce5afbd86482f58ab74a7': { id: '5b7f685e02fce5afbd86482f58ab74a7', name: 'PURR Flow', subDiagrams: [] },
          a639932d736c04b4bff28b4a20b6f751: { id: 'a639932d736c04b4bff28b4a20b6f751', name: 'YODEL Flow', subDiagrams: [] },
          '2691dd0790d70f21970bf1e354fb7ccf': { id: '2691dd0790d70f21970bf1e354fb7ccf', name: 'WHAT TO DO', subDiagrams: [] },
          '70e338927a3a10f494fe98a1a2fce110': { id: '70e338927a3a10f494fe98a1a2fce110', name: 'Enemy Generator', subDiagrams: [] },
          '573f595884112a0ebe0cf6399743581c': { id: '573f595884112a0ebe0cf6399743581c', name: 'ROAR Flow', subDiagrams: [] },
          '712f3c2dd392baeaaf75b538dd46b8fe': {
            id: '712f3c2dd392baeaaf75b538dd46b8fe',
            name: 'Meowing FLOW',
            subDiagrams: ['a418d71f572b957cb32466846cd7d3a5'],
          },
          '8d73d9d48644c322b474ad765749b44f': { id: '8d73d9d48644c322b474ad765749b44f', name: 'SPEAK Flow', subDiagrams: [] },
          f636101a4ee563298366a4bc996d847f: { id: 'f636101a4ee563298366a4bc996d847f', name: 'GOLF Flow', subDiagrams: [] },
          '609a64ed3b274695baf8dd0aae99a095': { id: '609a64ed3b274695baf8dd0aae99a095', name: 'New GAME', subDiagrams: [] },
          a418d71f572b957cb32466846cd7d3a5: { id: 'a418d71f572b957cb32466846cd7d3a5', name: 'Cynthia FLOW', subDiagrams: [] },
          '1a6073c82e37ee04a3f082af26879957': { id: '1a6073c82e37ee04a3f082af26879957', name: 'WEIGHT LIFTING Flow', subDiagrams: [] },
          '19ae995c698f36668dd30cfbdf6bf033': { id: '19ae995c698f36668dd30cfbdf6bf033', name: 'Junk Yard FLOW', subDiagrams: [] },
          '564e2361252a03199b0aa9d09259b7a7': { id: '564e2361252a03199b0aa9d09259b7a7', name: 'Alley FLOW', subDiagrams: [] },
          '9458b4ec7f97908fa092efacdc1aaf36': { id: '9458b4ec7f97908fa092efacdc1aaf36', name: 'CAT IS FULL', subDiagrams: [] },
          '9b6175add20d7fc58b0f8e2a93c0b004': { id: '9b6175add20d7fc58b0f8e2a93c0b004', name: 'WALK', subDiagrams: [] },
          '5a2cde599ba323b4b0f40c6c1c07adeb': { id: '5a2cde599ba323b4b0f40c6c1c07adeb', name: 'RUNNING Flow', subDiagrams: [] },
          a075ac5bc4d92f269aaeb0889e4fb22a: { id: 'a075ac5bc4d92f269aaeb0889e4fb22a', name: 'Adventure', subDiagrams: [] },
          '653d53171015c85290e9b25d3d414e19': { id: '653d53171015c85290e9b25d3d414e19', name: 'Buy KARMA', subDiagrams: [] },
          ece5fe021582e9b0ae9614ff9fdbfc76: { id: 'ece5fe021582e9b0ae9614ff9fdbfc76', name: 'PIANO Flow', subDiagrams: [] },
          '9823e9f6c1f5193abf732fd397df3616': { id: '9823e9f6c1f5193abf732fd397df3616', name: 'Pet Shop', subDiagrams: [] },
          '6146a62432c6bdc4b67ce8c43b3aa182': { id: '6146a62432c6bdc4b67ce8c43b3aa182', name: 'Stop Flow', subDiagrams: [] },
          '10f8c115b4a9a6e688c34671b1cb304d': { id: '10f8c115b4a9a6e688c34671b1cb304d', name: 'Michael FLOW', subDiagrams: [] },
          '306d1c9248ca4cb7b4c461c1bfda7b0e': { id: '306d1c9248ca4cb7b4c461c1bfda7b0e', name: 'DRUM Flow', subDiagrams: [] },
          '6f62e81605047bc6a8ffb4af94b229ec': { id: '6f62e81605047bc6a8ffb4af94b229ec', name: 'BOWLING Flow', subDiagrams: [] },
          a83b7775e40c3551aaf859137b41c0d5: { id: 'a83b7775e40c3551aaf859137b41c0d5', name: 'Buy HEALTH', subDiagrams: [] },
          '0c8d5f6cec2201acbcc3c03a208ee759': { id: '0c8d5f6cec2201acbcc3c03a208ee759', name: 'WHAT DID I BUY', subDiagrams: [] },
          '33b8177576df70ec9078294d29b1603a': { id: '33b8177576df70ec9078294d29b1603a', name: 'SKATEBOARD Flow', subDiagrams: [] },
          '41f1667cbb77bd049807827c47836a5c': { id: '41f1667cbb77bd049807827c47836a5c', name: 'YMCA Flow', subDiagrams: [] },
          '3d17dba1a06b688790c40961b72659dc': { id: '3d17dba1a06b688790c40961b72659dc', name: 'ROOT', subDiagrams: [] },
          '73f726af32fa8378a0f77083cc080a9e': { id: '73f726af32fa8378a0f77083cc080a9e', name: 'REFUND Flow', subDiagrams: [] },
          '4b8ee42710dc16f8a89ae51af16cc869': { id: '4b8ee42710dc16f8a89ae51af16cc869', name: 'BEAT BOX Flow', subDiagrams: [] },
          '41bfe51242c6abe5b3bb028db03ff601': { id: '41bfe51242c6abe5b3bb028db03ff601', name: 'TAP DANCE Flow', subDiagrams: [] },
          '96adb798e13d6876a5ae4269a292446e': { id: '96adb798e13d6876a5ae4269a292446e', name: 'AXE THROW Flow', subDiagrams: [] },
        },
      },
      workspace: {
        byId: {
          1: {
            members: [
              { name: 'User', image: 'https://picsum.photos/200', creator_id: userId, role: UserRole.ADMIN },
              { name: 'Manager', image: '5891FB|EFF5FF', creator_id: '2', role: UserRole.ADMIN },
              { name: 'Admin', image: 'https://picsum.photos/200?1', creator_id: '3', role: UserRole.ADMIN },
            ],
          },
        },
        allIDs: [1],
        activeWorkspaceID: 1,
      },
    }),
    (Component) => (
      <div style={{ width: '500px', height: '100vh', minHeight: '500px', position: 'relative', overflow: 'hidden' }}>
        <RolePermissionsProvider>
          <EditPermissionProvider>
            <ShortcutModalProvider>
              <EventualEngineProvider>
                <OverlayProvider>
                  <RegisterEngine
                    engine={{
                      canvas: {
                        zoomIn: action('zoomIn'),
                        zoomOut: action('zoomOut'),
                        applyTransition: action('applyTransition'),
                      },
                    }}
                  />
                  <Component />
                  <ConfirmModal />
                  <ErrorModal />
                </OverlayProvider>
              </EventualEngineProvider>
            </ShortcutModalProvider>
          </EditPermissionProvider>
        </RolePermissionsProvider>
      </div>
    )
  );

export const base = createStory()(() => <LeftSidebar />);
export const cantEdit = createStory({ userId: 0 })(() => <LeftSidebar />);
export const stepsAlexa = createStory({ platform: 'alexa' })(() => <LeftSidebar />);
export const stepsGoogle = createStory({ platform: 'google' })(() => <LeftSidebar />);
export const flowsSelected = createStory({ tab: 'flows' })(() => <LeftSidebar />);
