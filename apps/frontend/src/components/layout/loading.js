'use client';
import ReactLoading from 'react-loading';
export const LoadingComponent = (props) => {
    return (<div className="flex-1 flex justify-center pt-[100px]">
      <ReactLoading type="spin" color="#E8243C" width={props.width || 100} height={props.height || 100}/>
    </div>);
};
//# sourceMappingURL=loading.js.map