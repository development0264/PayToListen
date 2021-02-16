/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-wrap-multilines */
import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import styled from 'styled-components';
import { DummyImage } from './common';
import guruImage from '../../../assets/images/guru.png';
import ShishyaImage from '../../../assets/images/shishya.png';

interface Props {
  guruLineages: {
    guru: any[];
    shishya: any[];
  };
  edit?: boolean;
  setShowGuruModal?: (value: boolean) => void;
  editGuru?: (value: number) => void;
  deleteGuru?: (value: {
    guruDetails: { id: string; name: string };
    id: string;
  }) => void;
  approveShisya?: (value: { id: string; approve: boolean }) => void;
  removeApproval?: (value: { id: string; approve: boolean }) => void;
}

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    flex: '1 1 50%',
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      //   backgroundColor: '#844DA0',
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(backgroundColor, #844DA0)`,
      color: 'var(color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'black',
      color: theme.palette.primary,
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

interface StyledTreeProps {
  labelText: string;
  labelIcon?: any;
  labelImage?: string;
  labelInfo?: string;
  color?: string;
  bgColor?: string;
  other?: any;
  nodeId: string;
  parentIcon?: boolean;
  edit?: boolean;
  setShowGuruModal?: (value: boolean) => void;
  editGuru?: (value: number) => void;
  deleteGuru?: () => void;
  addGuru?: boolean;
  index?: number;
  approveShisya?: () => void;
  removeApproval?: () => void;
  isVerified?: boolean;
}

interface NodeItemProps {
  classes: any;
  labelText: string;
  labelInfo: string;
  parentIcon?: boolean;
  labelImage: string;
}

const NodeItem: FC<NodeItemProps> = ({
  classes,
  labelText,
  labelInfo,
  parentIcon,
  labelImage,
}: NodeItemProps): JSX.Element => {
  return (
    <div className={classes.labelRoot}>
      {parentIcon ? (
        <IconImage>
          <img src={labelImage} alt={labelText} />
        </IconImage>
      ) : (
        <img src={labelImage} className={classes.labelImage} alt={labelText} />
      )}
      <Typography
        variant="body2"
        className={classes.labelText}
        style={{ color: 'white' }}
      >
        {labelText}
      </Typography>
      <Typography variant="caption" color="inherit">
        {labelInfo}
      </Typography>
    </div>
  );
};

const StyledTreeItem: FC<StyledTreeProps> = ({
  labelText,
  parentIcon,
  labelInfo,
  color,
  bgColor,
  labelImage,
  edit,
  setShowGuruModal,
  editGuru,
  index,
  deleteGuru,
  addGuru,
  isVerified,
  approveShisya,
  removeApproval,
  ...other
}: StyledTreeProps) => {
  const classes = useTreeItemStyles();
  const openGuruModal = (e): void => {
    e.preventDefault();
    e.stopPropagation();
    setShowGuruModal(true);
  };
  const openEditGuruModal = (e): void => {
    e.preventDefault();
    e.stopPropagation();
    editGuru(index);
  };

  return (
    <TreeItem
      label={
        <LabelContainer>
          <NodeItem
            {...{
              classes,
              labelText,
              labelInfo,
              parentIcon,
              labelImage,
            }}
          />
          {edit && (
            <>
              <ActionColumn>
                {deleteGuru && (
                  <span onClick={deleteGuru} onKeyDown={deleteGuru}>
                    <i className="fa fa-trash" />
                  </span>
                )}
                {editGuru && (
                  <span
                    onClick={openEditGuruModal}
                    onKeyDown={openEditGuruModal}
                  >
                    <i className="fa fa-pencil" />
                  </span>
                )}
              </ActionColumn>
              {!isVerified && approveShisya && (
                <span
                  onClick={approveShisya}
                  onKeyDown={approveShisya}
                  title="Approve"
                >
                  <i className="fa fa-check" />
                </span>
              )}

              {isVerified && (
                <span
                  onClick={removeApproval}
                  onKeyDown={removeApproval}
                  title="Reject"
                >
                  <i className="fa fa-times" />
                </span>
              )}
              {addGuru && (
                <span onClick={openGuruModal} onKeyDown={openGuruModal}>
                  <i className="fa fa-plus-circle" />
                </span>
              )}
            </>
          )}
        </LabelContainer>
      }
      style={{
        color: 'white',
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 400,
  },
});

const GuruShishyaTreeView: FC<Props> = ({
  guruLineages,
  edit,
  setShowGuruModal,
  editGuru,
  deleteGuru,
  approveShisya,
  removeApproval,
}: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Container>
      <TreeView
        className={classes.root}
        defaultExpanded={['1']}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
      >
        {guruLineages?.guru?.length > 0 && (
          <StyledTreeItem
            {...{
              nodeId: '1',
              labelText: 'MY GURUS',
              parentIcon: true,
              labelImage: guruImage,
              addGuru: true,
              edit,
              setShowGuruModal,
            }}
          >
            {guruLineages?.guru.map((guru, index: number) => {
              const { name, id, image } = guru?.guruDetails;
              if (!edit && !guru.isVerified) {
                return null;
              }
              return (
                <StyledTreeItem
                  key={id}
                  {...{
                    edit,
                    editGuru,
                    index,
                    nodeId: id,
                    labelText: name,
                    labelImage: image || DummyImage,
                    deleteGuru: (): void => deleteGuru(guru),
                  }}
                />
              );
            })}
          </StyledTreeItem>
        )}
      </TreeView>
      <TreeView
        className={classes.root}
        defaultExpanded={['2']}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
      >
        {guruLineages?.shishya?.length > 0 && (
          <StyledTreeItem
            nodeId="2"
            labelText="MY SHISHYAS"
            parentIcon
            edit={edit}
            labelImage={ShishyaImage}
          >
            {guruLineages?.shishya.map((shishya) => {
              const { name, id, image } = shishya?.shishyaDetails;
              if (!edit && !shishya.isVerified) {
                return null;
              }
              return (
                <StyledTreeItem
                  key={id}
                  {...{
                    edit,
                    approveShisya: (): void =>
                      approveShisya({ id: shishya.id, approve: true }),
                    removeApproval: (): void =>
                      removeApproval({ id: shishya.id, approve: false }),
                    nodeId: id,
                    labelText: name,
                    labelImage: image || DummyImage,
                    isVerified: shishya.isVerified,
                  }}
                />
              );
            })}
          </StyledTreeItem>
        )}
      </TreeView>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  .MuiTreeItem-label {
    width: 100%;
    position: relative;
    padding-left: 4px;
    background-color: black;
    border-radius: 10px;
    margin-top: 1.5rem;
    padding: 0 0.3rem;
  }
  ul.MuiCollapse-container {
    position: relative;
    border-left: 2px solid white;
    margin-left: 1.8rem;
    margin-top: -0.4rem;
  }
  .MuiTreeItem-iconContainer {
    display: none;
  }
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
  }
`;
const IconImage = styled.div`
  background-color: ${({ theme }): string => theme.white};
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  img {
    width: 30px;
    height: 30px;
  }
`;
const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    padding-left: 0.5rem;
  }
  .fa {
    font-size: 20px;
  }
  .fa-plus-circle,
  .fa-check {
    color: ${({ theme }): string => theme.green};
  }
  .fa-trash,
  .fa-pencil,
  .fa-times {
    color: ${({ theme }): string => theme.primary};
  }
`;
const ActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export default GuruShishyaTreeView;
