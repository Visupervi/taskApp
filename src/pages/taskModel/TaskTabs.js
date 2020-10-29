import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TaskIndexPage from  './TaskIndexPage'
import TaskStore from './TaskStore'
import appStore from '../../sys/AppStore';

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 0 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    root: {
        // backgroundColor: theme.palette.background.paper,
        backgroundColor: '#f6f6f6',
        flex:1,
        height:50,
        color:"#333",
    },
    tabs:{
        background:"#fff",
        color:"#333"
    },
    indicator:{
        backgroundColor:" #ff5651"
    }
});

class TaskTabs extends React.Component {
    state = {
        value: 0,
        store : new TaskStore(appStore)
    };

    handleChange = async(event, value) => {
        await this.state.store.tabChange(value)
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    render() {
        const { classes, theme } = this.props;
        return (
            <div className={classes.root}>
                {/* <AppBar position="static" color="default">
                    <Tabs
                        className={classes.tabs}
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        fullWidth
                    >
                        <Tab label="已完成" />
                        <Tab label="未完成" />
                    </Tabs>
                </AppBar> */}
                {this.state.store.isFinishValue===0 && <TabContainer dir={theme.direction}>
                    <TaskIndexPage isShow={true} orderByData={{isFinished:true,isExpired:null}} history={this.props.history}/>
                </TabContainer>}
                {this.state.store.isFinishValue===1 && <TabContainer dir={theme.direction}>
                    <TaskIndexPage isShow={true} orderByData={{isFinished:false,isExpired:true}} history={this.props.history}/>
                </TabContainer>}
            </div>
        );
    }
}

TaskTabs.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TaskTabs);
