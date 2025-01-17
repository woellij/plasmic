import React from "react";
import type { SwitchProps } from "react-aria-components";
import { Switch } from "react-aria-components";
import { getCommonInputProps } from "./common";
import {
  UpdateInteractionVariant,
  pickAriaComponentVariants,
} from "./interaction-variant-utils";
import { DESCRIPTION_COMPONENT_NAME } from "./registerDescription";
import { LABEL_COMPONENT_NAME } from "./registerLabel";
import {
  CodeComponentMetaOverrides,
  Registerable,
  makeComponentName,
  registerComponentHelper,
} from "./utils";

const SWITCH_INTERACTION_VARIANTS = [
  "hovered" as const,
  "pressed" as const,
  "focused" as const,
  "focusVisible" as const,
];

const { interactionVariants, withObservedValues } = pickAriaComponentVariants(
  SWITCH_INTERACTION_VARIANTS
);

interface BaseSwitchProps extends SwitchProps {
  children: React.ReactNode;
  // Optional callback to update the interaction variant state
  // as it's only provided if the component is the root of a Studio component
  updateInteractionVariant?: UpdateInteractionVariant<
    typeof SWITCH_INTERACTION_VARIANTS
  >;
}

export function BaseSwitch(props: BaseSwitchProps) {
  const { children, updateInteractionVariant, ...rest } = props;

  return (
    <Switch {...rest}>
      {({ isHovered, isPressed, isFocused, isFocusVisible }) =>
        withObservedValues(
          children,
          {
            hovered: isHovered,
            pressed: isPressed,
            focused: isFocused,
            focusVisible: isFocusVisible,
          },
          updateInteractionVariant
        )
      }
    </Switch>
  );
}

export function registerSwitch(
  loader?: Registerable,
  overrides?: CodeComponentMetaOverrides<typeof BaseSwitch>
) {
  registerComponentHelper(
    loader,
    BaseSwitch,
    {
      name: makeComponentName("switch"),
      displayName: "Aria Switch",
      importPath: "@plasmicpkgs/react-aria/skinny/registerSwitch",
      importName: "BaseSwitch",
      interactionVariants,
      defaultStyles: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 0,
      },
      props: {
        ...getCommonInputProps<SwitchProps>("switch", [
          "name",
          "isDisabled",
          "isReadOnly",
          "autoFocus",
          "aria-label",
        ]),
        children: {
          type: "slot",
          mergeWithParent: true as any,
          defaultValue: [
            {
              type: "hbox",
              styles: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: 0,
              },
              children: [
                {
                  // the track
                  type: "hbox",
                  styles: {
                    width: "30px",
                    height: "16px",
                    padding: 0,
                    backgroundColor: "#D5D5D5",
                    cursor: "pointer",
                    borderRadius: "999px",
                  },
                  children: {
                    // the thumb
                    type: "hbox",
                    styles: {
                      width: "12px",
                      height: "12px",
                      position: "absolute",
                      top: "2px",
                      left: "2px",
                      borderRadius: "100%",
                      backgroundColor: "#fff",
                      padding: 0,
                      transitionProperty: "all",
                      transitionDuration: "0.5s",
                      transitionTimingFunction: "ease-in-out",
                    },
                  },
                },
                {
                  // the label
                  type: "component",
                  name: LABEL_COMPONENT_NAME,
                  props: {
                    children: {
                      type: "text",
                      value: "Label",
                    },
                  },
                },
              ],
            },
            {
              type: "component",
              name: DESCRIPTION_COMPONENT_NAME,
              styles: {
                fontSize: "12px",
              },
              props: {
                children: {
                  type: "text",
                  value: "Add interaction variants to see it in action...",
                },
              },
            },
          ],
        },
        value: {
          type: "boolean",
          editOnly: true,
          uncontrolledProp: "defaultSelected",
          description: "Whether the switch is toggled on",
          defaultValueHint: false,
        },
        onChange: {
          type: "eventHandler",
          argTypes: [{ name: "isSelected", type: "boolean" }],
        },
      },
      states: {
        isSelected: {
          type: "writable",
          valueProp: "value",
          onChangeProp: "onChange",
          variableType: "boolean",
        },
      },
      trapsFocus: true,
    },
    overrides
  );
}
