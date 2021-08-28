import React, { Component, Fragment } from 'react';

const getDisplayName = WrappedComponent => {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export const withConsumer = (...consumers) => WrappedComponent => {
    class WithConsumer extends Component {
        static WrappedComponent = WrappedComponent;

        render() {
            let propsArr = {};
            return consumers.reduceRight((accumulator, Consumer, index) => {
                return (
                    <Consumer>
                        {props => {
                            propsArr = { ...propsArr, ...props };
                            return (
                                <Fragment>
                                    {accumulator}
                                    {(index + 1) === consumers.length ? (
                                        <WrappedComponent {...this.props} {...propsArr} />
                                    ) : ''}
                                </Fragment>
                            );
                        }}
                    </Consumer>
                );
            }, '');
        }

    }

    WithConsumer.displayName = `WithConsumer(${getDisplayName(WrappedComponent)})`;
    return WithConsumer;
};