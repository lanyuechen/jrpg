import { Tilemap, useTilemapLoader } from 'react-pixi-tilemap';

export default (props) => {
  const { children, src } = props;
  const map = useTilemapLoader(src);

  return (
    <Tilemap map={map} {...props}>
      {children}
    </Tilemap>
  );
};
