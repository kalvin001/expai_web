import KNavBase from './knav_base';
import KNavTree from './knav_tree';

const KNav = ({ data, onChange,navType }) => { 
  return ( 
    navType === 'tree'? <KNavTree data={data} onChange={onChange} />:<KNavBase data={data} onChange={onChange} />
  );
};
export default KNav;
