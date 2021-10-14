import { Tilemap, useTilemapLoader } from 'react-pixi-tilemap';

const tilemap = PUBLIC_PATH + 'maps/test.tmx';

export default (props) => {
  const { children } = props;
  const map = useTilemapLoader(tilemap);

  return (
    <Tilemap map={map} {...props}>
      {children}
    </Tilemap>
  );
};
