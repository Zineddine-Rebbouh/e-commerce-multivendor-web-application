import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar = () => {
    return (
        <div className={ "space-y-4" }>
            <div className={ "bg-white rounded-lg p-2" }>
                <div className={ "" }>
                    <img src="/astronaut.png" alt="" fill />
                </div>
                <div className={ "" }>
                    <span className={ "font-bold text-lg" }>🔥 Available Now</span>
                    <h3 className={ "" }>
                        How to use the new version of the admin dashboard ?
                    </h3 >
                    <span className={ "" }> Takes 4 minutes to learn</span >
                    <p className={ "" }>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Reprehenderit eius libero perspiciatis recusandae possimus.
                    </p>
                    <button className={ "" }>
                        <MdPlayCircleFilled size={ 24 } />
                        Watch
                    </button >
                </div >
            </div >
            <div className={ "bg-white rounded-lg p-2" }>
                <div className={ "" }>
                    <span className={ "font-bold text-lg" }>🚀 Coming Soon</span>
                    <h3 className={ "" }>
                        New server actions are available, partial pre-rendering is coming
                        up!
                    </h3>
                    <span className={ "" }>Boost your productivity</span>
                    <p className={ "" }>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Reprehenderit eius libero perspiciatis recusandae possimus.
                    </p>
                    <button className={ "" }>
                        <MdReadMore size={ 24 } />
                        Learn
                    </button>
                </div >
            </div >
        </div >
    );
};

export default Rightbar;