/**
 * Created by Soon on 9/2/2015.
 */
export default class RegExes {
  static POSITIVE_INTEGER = /^[1-9]\d*$/;
  static MATRIX_VALUE = /matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/;
  static NON_NULL = /^[^\s]*$/g;
}
